<template>
  <BaseLayout :page="page">
    <div>
      <slot name="default" />

      <section class="blog_section">
        <h3>Latest blog posts</h3>
        <ul class="homepage_blog_list">
          <li v-for="post in latestPosts" :key="post.permalink">
            <a :href="post.permalink">
              {{ post.title }}
            </a>
            <div class="mt-0 mb-4" v-html="post.attributes.excerpt"></div>
          </li>
        </ul>
        <a href="/posts">see more</a>
      </section>
    </div>
  </BaseLayout>
</template>

<script>
import BaseLayout from "@/components/BaseLayout.vue";
export default {
  components: { BaseLayout },
  props: ["page"],
  computed: {
    latestPosts() {
      const latestPosts = this.page.posts.slice(0, 3);
      return latestPosts;
    },
  },
};
</script>

<style>
.blog_section {
  border-top: solid antiquewhite 1px;
}
.homepage_blog_list {
  list-style: none;
  padding-left: 0;
}
</style>
