import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("password hashing", () => {
  it("verifies a correct password", async () => {
    const hash = await hashPassword("correct horse battery staple");
    expect(await verifyPassword("correct horse battery staple", hash)).toBe(true);
  });

  it("rejects a wrong password", async () => {
    const hash = await hashPassword("password-one");
    expect(await verifyPassword("password-two", hash)).toBe(false);
  });

  it("produces unique salts per hash", async () => {
    const h1 = await hashPassword("same input");
    const h2 = await hashPassword("same input");
    expect(h1).not.toBe(h2);
  });

  it("rejects malformed stored hashes safely", async () => {
    expect(await verifyPassword("x", "garbage")).toBe(false);
    expect(await verifyPassword("x", "")).toBe(false);
  });
});
