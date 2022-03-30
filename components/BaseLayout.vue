<template>
  <main role="main">
    <NavBar />
    <slot />
    <div class="signup">
      <p>Want to get updates and new posts via email?</p>
      <form
        action="https://buttondown.email/api/emails/embed-subscribe/johnwhiles"
        method="post"
        target="popupwindow"
        onsubmit="window.open('https://buttondown.email/johnwhiles', 'popupwindow')"
        class="embeddable-buttondown-form"
      >
        <label for="bd-email">Enter your email</label>
        <input type="email" name="email" id="bd-email" />
        <input type="submit" value="Subscribe" />
      </form>
    </div>
  </main>
</template>

<style>
main {
  margin-right: auto;
  margin-left: auto;
  padding-right: 2rem;
  padding-left: 2rem;
  max-width: 800px;
  font-size: 18px;
  font-family: sans-serif;
}
.halfwidth {
  max-width: 400px;
}
.signup {
  border-top: 3px solid #f0f0f0;
  margin-top: 1rem;
  padding-top: 1rem;
}
</style>

<script>
import NavBar from "./NavBar.vue";

export default {
  props: ["page"],
  components: {
    NavBar
  },
  head() {
    const pageTitle = this.page && this.page.title;
    const siteTitle = this.$siteConfig.title;
    return {
      title: pageTitle ? `${pageTitle} - ${siteTitle}` : siteTitle,
      link: [
        {
          rel: "alternate",
          type: "application/rss+xml",
          title: "john_whiles_rss_feed",
          href: "https://www.johnwhiles.com/atom.xml"
        }
      ],
      script: [
        {
          defer: "true",
          "data-domain": "johnwhiles.com",
          src: "https://plausible.io/js/plausible.js"
        }
      ]
    };
  }
};
</script>
