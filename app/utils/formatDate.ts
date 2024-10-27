export const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB");
};

export const formatDateLong = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};
