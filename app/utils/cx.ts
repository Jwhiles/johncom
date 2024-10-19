const cx = (...args: Array<undefined | null | string | boolean>): string => {
  return args.filter((x) => typeof x === "string").join(" ");
};

export default cx;
