<template>
  <div>
    <h1>My Blog</h1>
    <ul class="blog_list">
      <li v-for="post in page.posts" :key="post.permalink">
        <h2 class="text-3xl mt-0">
          <saber-link
            :to="post.attributes.permalink"
            :title="`Read ${post.attributes.title}`"
            class="text-black font-extrabold"
          >
            {{ post.attributes.title }}
          </saber-link>
        </h2>

        <div class="mt-0 mb-4" v-html="post.attributes.excerpt"></div>
      </li>
    </ul>

    <a :href="page.pagination.nextLink" v-if="page.pagination.hasNext">
      Newer
    </a>

    <a :href="page.pagination.prevLink" v-if="page.pagination.hasPrev">
      Older
    </a>
  </div>
</template>

<script>
export const data = {
  layout: "page",
  title: "All blog postos",
  injectAllPosts: true,
};

export default {
  props: ["page"],
};
</script>

<style>
.blog_list {
  list-style: none;
  padding-left: 0;
}
</style>
