// ABOUTME: Unit tests for date formatting utility functions
// ABOUTME: Tests various date formatting functions to ensure consistent output across different date inputs
import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatDateLong,
  formatNoteDateTime,
  formatNoteDisplay,
  getCurrentISOString,
} from "./formatDate";

describe("formatDate", () => {
  it("should format date string to UK format", () => {
    const result = formatDate("2024-01-15");
    expect(result).toBe("15/01/2024");
  });

  it("should handle ISO date strings", () => {
    const result = formatDate("2024-12-25T10:30:00Z");
    expect(result).toBe("25/12/2024");
  });
});

describe("formatDateLong", () => {
  it("should format Date object to long US format", () => {
    const date = new Date("2024-01-15");
    const result = formatDateLong(date);
    expect(result).toBe("January 15, 2024");
  });
});

describe("formatNoteDateTime", () => {
  it("should format date string with weekday and time", () => {
    const result = formatNoteDateTime("2024-01-15T10:30:00Z");
    expect(result).toMatch(/Mon, Jan 15, 2024/);
  });
});

describe("formatNoteDisplay", () => {
  it("should format date string to short month and day", () => {
    const result = formatNoteDisplay("2024-01-15");
    expect(result).toBe("Jan 15");
  });
});

describe("getCurrentISOString", () => {
  it("should return a valid ISO string", () => {
    const result = getCurrentISOString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
});
