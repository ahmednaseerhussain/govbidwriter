import { describe, it, expect } from "vitest";
import { parseStringArray, toJsonString, splitList } from "@/lib/json";

describe("json helpers", () => {
  it("round-trips string arrays", () => {
    const arr = ["541511", "561720"];
    expect(parseStringArray(toJsonString(arr))).toEqual(arr);
  });

  it("returns [] for null, garbage, and non-arrays", () => {
    expect(parseStringArray(null)).toEqual([]);
    expect(parseStringArray("not json")).toEqual([]);
    expect(parseStringArray('{"a":1}')).toEqual([]);
  });

  it("filters non-string entries", () => {
    expect(parseStringArray('["a", 1, null, "b"]')).toEqual(["a", "b"]);
  });

  it("splits comma and newline separated lists, trimming blanks", () => {
    expect(splitList("541511, 561720\n236220,  ,")).toEqual([
      "541511",
      "561720",
      "236220",
    ]);
    expect(splitList("")).toEqual([]);
    expect(splitList(null)).toEqual([]);
  });
});
