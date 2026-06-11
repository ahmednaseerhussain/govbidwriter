// Simple in-memory sliding-window rate limiter.
//
// Good enough for a single-instance MVP (and per-instance abuse protection on
// serverless). Swap the store for Redis/Upstash when scaling — the call sites
// only use `checkRateLimit`, so the implementation can change freely.

type Bucket = { timestamps: number[] };

const store = new Map<string, Bucket>();

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function checkRateLimit(
  key: string,
  opts: { limit: number; windowMs: number }
): RateLimitResult {
  const now = Date.now();
  const bucket = store.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < opts.windowMs);

  if (bucket.timestamps.length >= opts.limit) {
    const oldest = bucket.timestamps[0];
    store.set(key, bucket);
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((oldest + opts.windowMs - now) / 1000),
    };
  }

  bucket.timestamps.push(now);
  store.set(key, bucket);

  // Opportunistic cleanup to bound memory.
  if (store.size > 10_000) {
    for (const [k, b] of store) {
      if (b.timestamps.every((t) => now - t >= opts.windowMs)) store.delete(k);
    }
  }

  return {
    ok: true,
    remaining: opts.limit - bucket.timestamps.length,
    retryAfterSeconds: 0,
  };
}

/** Rate limit presets. */
export const RATE_LIMITS = {
  // AI generation from authenticated dashboard users
  aiGeneration: { limit: 20, windowMs: 60 * 60 * 1000 },
  // Public free tools (keyed by IP) — stricter
  publicTool: { limit: 5, windowMs: 60 * 60 * 1000 },
  // File uploads
  upload: { limit: 10, windowMs: 60 * 60 * 1000 },
  // Auth attempts (keyed by IP)
  auth: { limit: 10, windowMs: 15 * 60 * 1000 },
} as const;
