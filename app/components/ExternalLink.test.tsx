// ABOUTME: Unit tests for ExternalLink component
// ABOUTME: Tests that external links render correctly with proper security attributes and accessibility features
import { describe, it, expect } from "vitest";
import { render, screen } from "../../test/test-utils";
import { ExternalLink } from "./ExternalLink";

describe("ExternalLink", () => {
  it("should render link with correct href", () => {
    render(<ExternalLink href="https://example.com">Test Link</ExternalLink>);

    const link = screen.getByRole("link", { name: "Test Link" });
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("should have security attributes", () => {
    render(<ExternalLink href="https://example.com">Test Link</ExternalLink>);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("rel", "nofollow noopener noreferrer");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("should render children content", () => {
    render(
      <ExternalLink href="https://example.com">Visit our website</ExternalLink>,
    );

    expect(screen.getByText("Visit our website")).toBeInTheDocument();
  });

  it("should pass through additional props", () => {
    render(
      <ExternalLink href="https://example.com" className="custom-class">
        Test Link
      </ExternalLink>,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveClass("custom-class");
  });
});
