import { describe, it, expect } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  it("allows up to the limit then blocks", () => {
    const key = `test-${Date.now()}-block`;
    const opts = { limit: 3, windowMs: 60_000 };
    expect(checkRateLimit(key, opts).ok).toBe(true);
    expect(checkRateLimit(key, opts).ok).toBe(true);
    expect(checkRateLimit(key, opts).ok).toBe(true);
    const fourth = checkRateLimit(key, opts);
    expect(fourth.ok).toBe(false);
    expect(fourth.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("tracks keys independently", () => {
    const opts = { limit: 1, windowMs: 60_000 };
    const a = `test-${Date.now()}-a`;
    const b = `test-${Date.now()}-b`;
    expect(checkRateLimit(a, opts).ok).toBe(true);
    expect(checkRateLimit(b, opts).ok).toBe(true);
    expect(checkRateLimit(a, opts).ok).toBe(false);
  });

  it("reports remaining quota", () => {
    const key = `test-${Date.now()}-remaining`;
    const opts = { limit: 5, windowMs: 60_000 };
    expect(checkRateLimit(key, opts).remaining).toBe(4);
    expect(checkRateLimit(key, opts).remaining).toBe(3);
  });
});
