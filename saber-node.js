exports.onCreatePage = function(p) {
  if (p.type === "post" && p.layout === undefined) {
    p.layout = "post";
    this.pages.createPage(p);
  }
};
