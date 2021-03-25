<template>
  <main role="main">
    <NavBar />
    <slot />
  </main>
</template>

<style>
main {
  max-width: 800px;
  font-size: 18px;
  font-family: sans-serif;
}
.halfwidth {
  max-width: 400px;
}
</style>

<script>
import NavBar from './NavBar.vue';

export default {
  props: ['page'],
  components: {
    NavBar,
  },
  head() {
    const pageTitle = this.page && this.page.title;
    const siteTitle = this.$siteConfig.title;
    return {
      title: pageTitle ? `${pageTitle} - ${siteTitle}` : siteTitle,
      link: [
        {
          rel: 'alternative',
          type: 'application/rss+xml',
          title: 'RSS Feed',
          href: this.$feed.permalink
        },
      ],
    };
  },
};
</script>
