// ABOUTME: Test utilities for rendering React components with providers and common setup
// ABOUTME: Provides custom render function and exports all testing-library/react utilities for easy importing
import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";

type CustomRenderOptions = Omit<RenderOptions, "wrapper">;

const customRender = (ui: ReactElement, options?: CustomRenderOptions) => {
  return render(ui, {
    ...options,
  });
};

export * from "@testing-library/react";
export { customRender as render };
