---
title: "Go Concurrency Patterns I Wish I Knew Earlier"
slug: "go-concurrency-patterns-i-wish-i-knew-earlier"
date: "2026-03-03"
tag: "Go"
readTime: "6 min read"
excerpt: "A practical guide to goroutines, channels, and context cancellation patterns that have saved me hours of debugging in production systems."
---

Go's concurrency model is one of its greatest strengths — and one of the most common sources of subtle bugs in production. After years of writing Go services that handle real traffic, here are the patterns I reach for constantly and the anti-patterns I've learned to avoid.

## 1. The Worker Pool

The most common pattern I use. Don't spawn a goroutine per item — you'll OOM under load. Instead, create a fixed pool:

```go
func workerPool(ctx context.Context, jobs <-chan Job, concurrency int) <-chan Result {
    results := make(chan Result, concurrency)
    var wg sync.WaitGroup

    for i := 0; i < concurrency; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for job := range jobs {
                select {
                case results <- process(ctx, job):
                case <-ctx.Done():
                    return
                }
            }
        }()
    }

    go func() {
        wg.Wait()
        close(results)
    }()

    return results
}
```

The `select` with `ctx.Done()` is critical — without it, goroutines hang forever when the context is cancelled.

## 2. errgroup for Fan-Out

`golang.org/x/sync/errgroup` is criminally underused. Use it whenever you're launching multiple goroutines that can fail:

```go
func fetchAll(ctx context.Context, urls []string) ([]Response, error) {
    g, ctx := errgroup.WithContext(ctx)
    results := make([]Response, len(urls))

    for i, url := range urls {
        i, url := i, url
        g.Go(func() error {
            resp, err := fetch(ctx, url)
            if err != nil {
                return fmt.Errorf("fetching %s: %w", url, err)
            }
            results[i] = resp
            return nil
        })
    }

    if err := g.Wait(); err != nil {
        return nil, err
    }
    return results, nil
}
```

`errgroup.WithContext` cancels the context when *any* goroutine returns an error, automatically stopping the others.

## 3. The Timeout Pattern

Never make a network call without a timeout. But the timeout should usually come from the *caller's* context:

```go
// Good: respect the caller's context, add a local cap
func callService(ctx context.Context, url string) (*Response, error) {
    ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
    defer cancel()
    return http.Get(ctx, url)
}
```

The `defer cancel()` is non-negotiable. Missing it leaks the timer goroutine.

## 4. Channel Ownership

The rule: **only the goroutine that creates a channel should close it**. If multiple senders exist, use a `sync.WaitGroup` in a coordinator:

```go
func merge(sources ...<-chan int) <-chan int {
    out := make(chan int)
    var wg sync.WaitGroup

    for _, src := range sources {
        wg.Add(1)
        go func(s <-chan int) {
            defer wg.Done()
            for v := range s {
                out <- v
            }
        }(src)
    }

    go func() {
        wg.Wait()
        close(out)
    }()

    return out
}
```

## 5. sync.Once for Expensive Initialization

Don't use `init()` for expensive operations. Use `sync.Once` so initialization is lazy:

```go
var (
    dbOnce    sync.Once
    db        *sql.DB
    dbInitErr error
)

func getDB() (*sql.DB, error) {
    dbOnce.Do(func() {
        db, dbInitErr = sql.Open("postgres", os.Getenv("DATABASE_URL"))
    })
    return db, dbInitErr
}
```

## Patterns to Avoid

**Goroutine leaks** — always provide a way to stop goroutines via `ctx.Done()`.

**Shared mutable state without locks** — the race detector (`go test -race`) catches these. Run it in CI, always.

**Closing a channel twice** — panics at runtime. Use `sync.Once` if you're not sure.

**Goroutines in `init()`** — they start before `main()` and their lifecycle is impossible to control.
