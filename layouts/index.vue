<template>
  <BaseLayout :page="page">
    <div class="home">
      <div class="home_left">
      <slot name="default" />
      </div>

      <section class="home_right">
        <nav>
        <strong>Latest</strong>
        <a href="/posts">All</a>
        <a href="/atom.xml">RSS feed</a>
        </nav>
        <ul class="homepage_blog_list">
          <li v-for="post in latestPosts" :key="post.permalink">
            <a class="blog_link" :href="post.permalink">
              <h4>
                {{ post.title }}
              </h4>
            </a>
          </li>
        </ul>
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
      const latestPosts = this.page.posts.slice(0, 10);
      return latestPosts;
    },
  },
};
</script>

<style>
.home {
  display: flex;
}

.home_left {
  margin-right: 20px;
  margin-top: 20px;
  width: 65%
}

.blog_link {
  text-decoration: none;
}
.home_right {
  width: 35%;
  margin-top: 20px;
}
.homepage_blog_list {
  list-style: none;
  padding-left: 0;
}
</style>
