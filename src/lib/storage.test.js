
import { describe, it, expect, beforeEach, vi } from "vitest";

import {
  readStoredValue,
  writeStoredValue,
  removeStoredValue,
} from "./storage";

describe("Local Storage Functions", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("returns fallback when key does not exist", () => {
    const result = readStoredValue("testKey", "default");

    expect(result).toBe("default");
  });

  it("reads and parses stored JSON data", () => {
    localStorage.setItem("user", JSON.stringify({ name: "Ali" }));

    const result = readStoredValue("user", {});

    expect(result).toEqual({ name: "Ali" });
  });

  it("returns fallback when stored JSON is invalid", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    localStorage.setItem("user", "{invalid json}");

    const result = readStoredValue("user", { name: "Guest" });

    expect(result).toEqual({ name: "Guest" });
    expect(errorSpy).toHaveBeenCalled();
  });

  it("returns fallback when validation fails", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    localStorage.setItem("age", JSON.stringify(15));

    const result = readStoredValue("age", 0, (value) => value >= 18);

    expect(result).toBe(0);
    expect(errorSpy).toHaveBeenCalled();
  });

  it("saves data in localStorage", () => {
    writeStoredValue("user", { name: "Sara" });

    expect(JSON.parse(localStorage.getItem("user"))).toEqual({
      name: "Sara",
    });
  });

  it("removes data from localStorage", () => {
    localStorage.setItem("user", JSON.stringify({ name: "Sara" }));

    removeStoredValue("user");

    expect(localStorage.getItem("user")).toBeNull();
  });
});
