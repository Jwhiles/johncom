// ABOUTME: Unit tests for tags route loader function
// ABOUTME: Tests Remix loader by mocking Prisma database queries and verifying response structure and headers
import { describe, it, expect, vi, beforeEach } from "vitest";
import { loader } from "./tags";

// Type for the Prisma tag with _count
type TagWithCount = {
  name: string;
  slug: string;
  _count: { posts: number };
};

// Mock the Prisma client
vi.mock("~/db.server", () => ({
  prisma: {
    tag: {
      findMany: vi.fn(),
    },
  },
}));

// Mock the headers utility
vi.mock("~/utils/headers", () => ({
  apiDefaultHeaders: {
    headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" },
  },
}));

// Import the mocked prisma after mocking
import { prisma } from "~/db.server";

describe("Tags Route Loader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch tags ordered by post count", async () => {
    // Arrange
    const mockTags: Array<TagWithCount> = [
      {
        name: "React",
        slug: "react",
        _count: { posts: 5 },
      },
      {
        name: "TypeScript",
        slug: "typescript",
        _count: { posts: 3 },
      },
    ];

    vi.mocked(prisma.tag.findMany).mockResolvedValue(mockTags as never);

    // Act
    const response = await loader();
    const data = await response.json();

    // Assert
    expect(prisma.tag.findMany).toHaveBeenCalledWith({
      orderBy: { posts: { _count: "desc" } },
      select: {
        name: true,
        slug: true,
        _count: {
          select: { posts: true },
        },
      },
    });

    expect(data).toEqual({
      tags: mockTags,
    });
  });

  it("should return correct response headers", async () => {
    // Arrange
    const mockTags: Array<TagWithCount> = [];
    vi.mocked(prisma.tag.findMany).mockResolvedValue(mockTags as never);

    // Act
    const response = await loader();

    // Assert
    expect(response.headers.get("Cache-Control")).toBe(
      "public, max-age=300, s-maxage=3600",
    );
    expect(response.status).toBe(200);
  });

  it("should handle empty tags list", async () => {
    // Arrange
    const mockTags: Array<TagWithCount> = [];
    vi.mocked(prisma.tag.findMany).mockResolvedValue(mockTags as never);

    // Act
    const response = await loader();
    const data = await response.json();

    // Assert
    expect(data).toEqual({
      tags: [],
    });
  });

  it("should handle database errors", async () => {
    // Arrange
    const dbError = new Error("Database connection failed");
    vi.mocked(prisma.tag.findMany).mockRejectedValue(dbError);

    // Act & Assert
    await expect(loader()).rejects.toThrow("Database connection failed");
  });
});
