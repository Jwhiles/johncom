const cx = (...args: (undefined | null | string | boolean)[]): string => {
  return args.filter((x) => typeof x === "string").join(" ");
};

export default cx;
