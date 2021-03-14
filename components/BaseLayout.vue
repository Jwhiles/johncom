<template>
  <main role="main">
    <slot />
  </main>
</template>


<style>
main {
  max-width: 800px;
  font-size: 18px;
  font-family: sans-serif
}
</style>

<script>
export default {
  props: ["page"],
  head() {
    const pageTitle = this.page && this.page.title;
    const siteTitle = this.$siteConfig.title;
    return {
      title: pageTitle ? `${pageTitle} - ${siteTitle}` : siteTitle,
    };
  },
};
</script>
