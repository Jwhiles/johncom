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

export const formatNoteDateTime = (date: string): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
};

export const formatNoteDisplay = (date: string): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(d);
};

export const getCurrentISOString = (): string => {
  return new Date().toISOString();
};

export const getCurrentLocalDateTime = (): string => {
  const now = new Date();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return new Date(
    now.toLocaleString("en-US", { timeZone: timezone }),
  ).toISOString();
};
