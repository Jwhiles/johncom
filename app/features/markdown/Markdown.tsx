import type { HTML } from "./types";

export const ShowMarkdown = ({
  markdown,
  className,
}: {
  markdown: HTML;
  className?: string;
}) => {
  return (
    <div
      className={`markdown${className ? ` ${className}` : ""}`}
      dangerouslySetInnerHTML={{
        __html: markdown,
      }}
    />
  );
};
