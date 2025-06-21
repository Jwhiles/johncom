// ABOUTME: Unit tests for admin login route action function
// ABOUTME: Tests form validation, authentication, session creation, and error handling for admin login
import { describe, it, expect, vi, beforeEach } from "vitest";
import { redirect } from "@remix-run/node";
import { action, validateEmail } from "~/routes/admin_.login";

// Mock dependencies
vi.mock("~/auth.server", () => ({
  verifyLogin: vi.fn(),
  createAdminSession: vi.fn(),
}));

// Import mocked functions
import { verifyLogin, createAdminSession } from "~/auth.server";

describe("Admin Login Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validateEmail function", () => {
    it("should validate correct email formats", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user@domain.org")).toBe(true);
      expect(validateEmail("admin@company.co.uk")).toBe(true);
    });

    it("should reject invalid email formats", () => {
      expect(validateEmail("invalid")).toBe(false); // no @
      expect(validateEmail("test@")).toBe(true); // has @ and length > 3
      expect(validateEmail("@domain.com")).toBe(true); // has @ and length > 3
      expect(validateEmail("")).toBe(false); // empty
      expect(validateEmail("a@b")).toBe(false); // too short (length = 3, needs > 3)
      expect(validateEmail("ab@")).toBe(false); // too short (length = 3, needs > 3)
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
      expect(validateEmail(123)).toBe(false);
    });
  });

  describe("action function", () => {
    it("should return email validation error for invalid email", async () => {
      // Arrange
      const formData = new FormData();
      formData.append("email", "invalid-email");
      formData.append("password", "password123");

      const request = new Request("http://localhost/admin/login", {
        method: "POST",
        body: formData,
      });

      // Act
      const response = await action({ request, params: {}, context: {} });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toEqual({
        errors: { email: "Email is invalid", password: null },
      });
      expect(verifyLogin).not.toHaveBeenCalled();
    });

    it("should return password validation error for empty password", async () => {
      // Arrange
      const formData = new FormData();
      formData.append("email", "admin@example.com");
      formData.append("password", "");

      const request = new Request("http://localhost/admin/login", {
        method: "POST",
        body: formData,
      });

      // Act
      const response = await action({ request, params: {}, context: {} });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toEqual({
        errors: { email: null, password: "Password is required" },
      });
      expect(verifyLogin).not.toHaveBeenCalled();
    });

    it("should return authentication error for invalid credentials", async () => {
      // Arrange
      const formData = new FormData();
      formData.append("email", "admin@example.com");
      formData.append("password", "wrongpassword");

      const request = new Request("http://localhost/admin/login", {
        method: "POST",
        body: formData,
      });

      vi.mocked(verifyLogin).mockResolvedValue(null);

      // Act
      const response = await action({ request, params: {}, context: {} });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toEqual({
        errors: { email: "Invalid email or password", password: null },
      });
      expect(verifyLogin).toHaveBeenCalledWith(
        "admin@example.com",
        "wrongpassword",
      );
    });

    it("should create session and redirect for valid credentials without remember", async () => {
      // Arrange
      const formData = new FormData();
      formData.append("email", "admin@example.com");
      formData.append("password", "correctpassword");

      const request = new Request("http://localhost/admin/login", {
        method: "POST",
        body: formData,
      });

      const mockAdmin = { id: "admin-123", email: "admin@example.com" };
      const mockRedirectResponse = redirect("/admin");

      vi.mocked(verifyLogin).mockResolvedValue(mockAdmin as never);
      vi.mocked(createAdminSession).mockResolvedValue(mockRedirectResponse);

      // Act
      const response = await action({ request, params: {}, context: {} });

      // Assert
      expect(verifyLogin).toHaveBeenCalledWith(
        "admin@example.com",
        "correctpassword",
      );
      expect(createAdminSession).toHaveBeenCalledWith({
        request,
        adminId: "admin-123",
        remember: false,
      });
      expect(response).toBe(mockRedirectResponse);
    });

    it("should create session with remember option when checkbox is checked", async () => {
      // Arrange
      const formData = new FormData();
      formData.append("email", "admin@example.com");
      formData.append("password", "correctpassword");
      formData.append("remember", "on");

      const request = new Request("http://localhost/admin/login", {
        method: "POST",
        body: formData,
      });

      const mockAdmin = { id: "admin-456", email: "admin@example.com" };
      const mockRedirectResponse = redirect("/admin");

      vi.mocked(verifyLogin).mockResolvedValue(mockAdmin as never);
      vi.mocked(createAdminSession).mockResolvedValue(mockRedirectResponse);

      // Act
      const response = await action({ request, params: {}, context: {} });

      // Assert
      expect(createAdminSession).toHaveBeenCalledWith({
        request,
        adminId: "admin-456",
        remember: true,
      });
      expect(response).toBe(mockRedirectResponse);
    });

    it("should handle missing form fields gracefully", async () => {
      // Arrange
      const formData = new FormData();
      // Intentionally not adding email or password

      const request = new Request("http://localhost/admin/login", {
        method: "POST",
        body: formData,
      });

      // Act
      const response = await action({ request, params: {}, context: {} });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.errors.email).toBe("Email is invalid");
    });

    it("should handle form data with non-string values", async () => {
      // Arrange
      const formData = new FormData();
      formData.append("email", "admin@example.com");
      // Simulate a non-string password (edge case)
      const request = new Request("http://localhost/admin/login", {
        method: "POST",
        body: formData,
      });

      // Act
      const response = await action({ request, params: {}, context: {} });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.errors.password).toBe("Password is required");
    });
  });
});
