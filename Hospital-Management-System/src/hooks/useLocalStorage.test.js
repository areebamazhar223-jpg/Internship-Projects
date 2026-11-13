
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import useLocalStorage from "./useLocalStorage";

describe("useLocalStorage Hook", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns the initial value when storage is empty", () => {
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "Hello"),
    );

    expect(result.current[0]).toBe("Hello");
  });

  it("loads existing data from localStorage", () => {
    localStorage.setItem("testKey", JSON.stringify("Saved Data"));

    const { result } = renderHook(() =>
      useLocalStorage("testKey", "Default"),
    );

    expect(result.current[0]).toBe("Saved Data");
  });

  it("updates the state and saves data to localStorage", async () => {
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "Initial"),
    );

    act(() => {
      result.current[1]("Updated Value");
    });

    expect(result.current[0]).toBe("Updated Value");

    await waitFor(() => {
      expect(localStorage.getItem("testKey")).toBe(
        JSON.stringify("Updated Value"),
      );
    });
  });

  it("supports functional state updates", async () => {
    const { result } = renderHook(() =>
      useLocalStorage("count", 0),
    );

    act(() => {
      result.current[1]((previous) => previous + 1);
    });

    expect(result.current[0]).toBe(1);

    await waitFor(() => {
      expect(localStorage.getItem("count")).toBe("1");
    });
  });
});
