import cx from "~/utils/cx";

import type { RendererHTML } from "./types";

export const ShowMarkdown = ({
  children,
  className,
}: {
  children: RendererHTML;
  className?: string;
}) => {
  return (
    <div
      className={cx("markdown", className)}
      dangerouslySetInnerHTML={{
        __html: children,
      }}
    />
  );
};
