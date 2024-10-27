// This type should only be created by the render function,
export type RendererHTML = string & { readonly __tag: unique symbol };
