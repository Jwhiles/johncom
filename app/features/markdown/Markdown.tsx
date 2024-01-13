import type { HTML } from "./types";

export const ShowMarkdown = ({
  children,
  className,
}: {
  children: HTML;
  className?: string;
}) => {
  return (
    <div
      className={`markdown${className ? ` ${className}` : ""}`}
      dangerouslySetInnerHTML={{
        __html: children,
      }}
    />
  );
};
