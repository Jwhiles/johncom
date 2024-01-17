import cx from "~/utils/cx";

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
      className={cx("markdown", className)}
      dangerouslySetInnerHTML={{
        __html: children,
      }}
    />
  );
};
