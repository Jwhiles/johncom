export const ExternalLink = ({
  href,
  children,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <a
      href={href}
      rel="nofollow noopener noreferrer"
      target="_blank"
      {...props}
    >
      {children}
    </a>
  );
};
