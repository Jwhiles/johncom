/// <reference types="@remix-run/node" />
/// <reference types="vite/client" />

declare module "*.mdx" {
  let MDXComponent: (props: unknown) => JSX.Element;
  export const frontmatter: unknown;
  export default MDXComponent;
}
