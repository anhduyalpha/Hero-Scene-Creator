---
title: "Zero-Knowledge Architecture: A Deep Dive"
slug: "zero-knowledge-architecture-deep-dive"
date: "2026-01-20"
tag: "Security"
readTime: "12 min read"
excerpt: "Exploring the cryptographic primitives and architecture patterns behind zero-knowledge systems, and how we implemented them in Vaultify."
---

Zero-knowledge (ZK) architecture means your server never sees plaintext secrets — not during storage, not during retrieval, not during transit. If your server is breached, the attacker gets encrypted blobs they can't use. This is harder to build than it sounds, and the implementation details matter enormously.

This is how we built Vaultify, our open-source secrets manager, with true ZK properties.

## What "Zero-Knowledge" Actually Means

A system is zero-knowledge if the server learns nothing useful about the plaintext even when:

1. You send it data
2. It stores data
3. You retrieve data
4. The server is fully compromised

This rules out "we encrypt at rest" — if your server holds the encryption key, it's not ZK. It also rules out "we hash passwords" — if the server can verify a password, it learns something.

True ZK means **all encryption and decryption happen client-side**, and the server only ever touches ciphertext.

## The Cryptographic Primitives

### 1. Key Derivation from Password

The foundation. We use **Argon2id** (the winner of the Password Hashing Competition) to derive a master key from the user's password:

```typescript
import { argon2id } from '@noble/hashes/argon2';
import { randomBytes } from '@noble/hashes/utils';

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const rawKey = argon2id(
    new TextEncoder().encode(password),
    salt,
    {
      t: 3,        // time cost: 3 iterations
      m: 65536,    // memory cost: 64MB
      p: 4,        // parallelism: 4 lanes
      dkLen: 32,   // 256-bit output
    }
  );

  return crypto.subtle.importKey(
    'raw', rawKey,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}
```

The salt is stored on the server (it's not secret — its job is to prevent rainbow table attacks), but the derived key never leaves the client.

### 2. Secret Encryption

Each secret is encrypted with AES-256-GCM using a random IV:

```typescript
async function encryptSecret(
  plaintext: string,
  masterKey: CryptoKey
): Promise<{ ciphertext: string; iv: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);

  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    masterKey,
    encoded
  );

  return {
    ciphertext: bufToBase64(new Uint8Array(cipherBuffer)),
    iv: bufToBase64(iv),
  };
}
```

The server receives `{ ciphertext, iv }` — both useless without the master key.

### 3. The Vault Key Problem

Here's the subtle challenge: what happens when the user changes their password? If secrets are encrypted with a key derived from the password, you'd have to re-encrypt every secret. At scale (millions of secrets), that's untenable.

The solution: **two-layer encryption**.

```
Password → Argon2id → Master Key
                           ↓
                    Vault Key (random, per-user)
                           ↓ (encrypted with Master Key)
                    Stored on server as "wrapped key"
                           ↓
                    Each Secret (encrypted with Vault Key)
```

When the user changes their password, we only re-wrap the Vault Key — a single operation. All secrets stay untouched.

```typescript
async function wrapVaultKey(
  vaultKey: CryptoKey,
  masterKey: CryptoKey
): Promise<string> {
  const exported = await crypto.subtle.exportKey('raw', vaultKey);
  const { ciphertext, iv } = await encryptSecret(bufToBase64(new Uint8Array(exported)), masterKey);
  return JSON.stringify({ ciphertext, iv });
}
```

## Authentication Without Seeing the Password

If we can't see the password, how do we authenticate?

We use **SRP (Secure Remote Password)** — a protocol where the server verifies a proof that the client knows the password without the password ever being sent. The math is elegant:

1. During registration: client computes a **verifier** `v = g^x mod N` where `x` is derived from the password
2. During login: client and server run a challenge-response exchange that proves knowledge of `x` without revealing it
3. The server stores only the verifier — useless without the password

We use `@opaque-ke/opaque` which implements OPAQUE (an improved SRP variant) with modern cryptography.

## What the Server Stores

For each user, the server holds:

| Field | Value | Useful to attacker? |
|-------|-------|---------------------|
| `auth_verifier` | OPAQUE verifier | No — can't reverse to password |
| `argon2_salt` | Random 32 bytes | No — useless without password |
| `wrapped_vault_key` | AES-GCM(vault_key, master_key) | No — needs master_key |
| `secrets[].ciphertext` | AES-GCM(plaintext, vault_key) | No — needs vault_key |
| `secrets[].iv` | Random 12 bytes | No — just a nonce |

A full server compromise exposes nothing plaintext.

## The Hard Parts

**Key memory management** — Master keys in JavaScript `CryptoKey` objects can't be extracted after import (we use `extractable: false`). But they live in JS heap until GC. For highly sensitive applications, consider WebAssembly with manual memory management.

**Multi-device sync** — How does Device B get the Vault Key? We use an asymmetric key exchange: Device A encrypts the Vault Key with Device B's public key and sends it through the server. The server sees an encrypted blob; Device B decrypts with its private key.

**Recovery codes** — If the user loses their password, they're locked out forever (that's the point). We generate BIP-39 mnemonic recovery codes during registration, from which the Vault Key can be recovered. These must be printed and stored offline.

**Search over encrypted data** — You can't. We use client-side filtering: fetch all encrypted names (encrypted deterministically with a separate key), decrypt them client-side, filter, then fetch the matching secrets. It's slower but it's the price of ZK.

## Is It Worth It?

For a secrets manager? Absolutely. For a general CRUD app? Probably not — the UX compromises (no server-side search, no recovery if you lose your password) are significant.

The implementation is available in the Vaultify repository. The cryptography primitives we use (`@noble/hashes`, `@noble/ciphers`) are audited and have no native dependencies, making them safe to use in the browser.
