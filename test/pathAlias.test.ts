// ABOUTME: Test to verify that path aliases work correctly in the test environment
// ABOUTME: Tests importing utilities using the "~" alias to ensure Vitest config properly resolves paths
import { describe, it, expect } from "vitest";
import { formatDate } from "~/utils/formatDate";

describe("Path Alias", () => {
  it("should resolve ~ alias to app directory", () => {
    const result = formatDate("2024-01-15");
    expect(result).toBe("15/01/2024");
  });
});
