// This type should only be created by the render function,
export type HTML = string & { readonly __tag: unique symbol };
