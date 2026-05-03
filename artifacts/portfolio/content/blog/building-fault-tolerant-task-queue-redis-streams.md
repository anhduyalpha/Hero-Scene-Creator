---
title: "Building a Fault-Tolerant Task Queue with Redis Streams"
slug: "building-fault-tolerant-task-queue-redis-streams"
date: "2026-04-12"
tag: "Engineering"
readTime: "8 min read"
excerpt: "How we scaled our background job processing to handle 10M+ daily tasks with exactly-once semantics and zero data loss using Redis Streams and consumer groups."
---

Background job processing is one of those infrastructure problems that looks simple until it isn't. You start with `setTimeout`, graduate to a message queue, then at some point you're debugging a production incident where 50,000 emails got sent twice during a Redis failover. This is the story of how we rebuilt our task queue on Redis Streams to get true exactly-once delivery.

## Why Redis Streams?

We evaluated three options: SQS, RabbitMQ, and Redis Streams. Our requirements were tight:

- **Sub-10ms enqueue latency** (we call this from the hot path of our API)
- **At-least-once delivery** with idempotency keys for exactly-once semantics
- **Consumer groups** so we can scale workers horizontally without duplicate processing
- **Visibility into queue depth** for our ops team

Redis Streams won on all counts. It's a persistent, append-only log with consumer group support built in. Unlike Pub/Sub, messages survive crashes. Unlike Redis Lists, it has native consumer group semantics.

## The Architecture

```
API Server → XADD → Redis Stream → Consumer Group → Worker Pool
                                         ↓
                                   Pending Entry List (PEL)
                                         ↓
                              XACK (on success) / Requeue (on failure)
```

Each job gets a unique ID via `XADD` and goes into the stream with a payload:

```go
func (q *Queue) Enqueue(ctx context.Context, job Job) (string, error) {
    id, err := q.redis.XAdd(ctx, &redis.XAddArgs{
        Stream: q.streamKey,
        Values: map[string]interface{}{
            "type":        job.Type,
            "payload":     job.Payload,
            "idempotency": job.IdempotencyKey,
            "created_at":  time.Now().UnixMilli(),
        },
    }).Result()
    return id, err
}
```

## Consumer Groups and Acknowledgment

The magic is in `XREADGROUP` + `XACK`. When a worker picks up a job, it goes into the **Pending Entry List (PEL)** — it's still "in-flight" from Redis's perspective. Only after a successful `XACK` does Redis consider it done.

```go
func (w *Worker) run(ctx context.Context) {
    for {
        msgs, err := w.redis.XReadGroup(ctx, &redis.XReadGroupArgs{
            Group:    w.group,
            Consumer: w.id,
            Streams:  []string{w.stream, ">"},
            Count:    10,
            Block:    2 * time.Second,
        }).Result()
        if err != nil { continue }

        for _, msg := range msgs[0].Messages {
            if err := w.process(ctx, msg); err == nil {
                w.redis.XAck(ctx, w.stream, w.group, msg.ID)
            }
        }
    }
}
```

## Handling Dead Letters

Jobs that fail repeatedly get moved to a dead-letter stream via a background reclaimer:

```go
func (r *Reclaimer) run(ctx context.Context) {
    ticker := time.NewTicker(10 * time.Second)
    for range ticker.C {
        msgs, _ := r.redis.XAutoClaim(ctx, &redis.XAutoClaimArgs{
            Stream:   r.stream,
            Group:    r.group,
            Consumer: r.id,
            MinIdle:  30 * time.Second,
            Start:    "0-0",
        }).Result()

        for _, msg := range msgs {
            attempts := getAttempts(msg)
            if attempts >= 3 {
                r.redis.XAdd(ctx, &redis.XAddArgs{
                    Stream: r.stream + ":dlq",
                    Values: msg.Values,
                })
                r.redis.XAck(ctx, r.stream, r.group, msg.ID)
            } else {
                incrementAttempts(msg)
            }
        }
    }
}
```

## Results

After deploying this system, our numbers:

| Metric | Before | After |
|--------|--------|-------|
| Enqueue p99 | 45ms | 3ms |
| Duplicate rate | 0.08% | 0.00% |
| Job throughput | 2M/day | 12M/day |
| Worker crash recovery | Manual | Automatic (< 30s) |

## Lessons Learned

1. **Set `MAXLEN` on your streams** — unbounded streams eat memory fast.
2. **Consumer IDs must be unique per process** — we use `hostname + PID`.
3. **Always monitor PEL depth** — a growing PEL means your workers are dying silently.
4. **Idempotency keys belong in your handler, not the queue** — the queue guarantees at-least-once; your handler must handle duplicates gracefully.
