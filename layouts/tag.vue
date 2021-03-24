<template>
  <BaseLayout :page="rage">
    <div>
      <h1>All posts tagged with: {{ this.page.tag }}</h1>

      <ul>
        <li v-for="post in page.posts" :key="post.permalink">
          <a :href="post.permalink">
            {{ post.title }}
          </a>
        </li>
      </ul>
    </div>
  </BaseLayout>
</template>

<script>
import BaseLayout from "@/components/BaseLayout.vue";
export default {
  components: { BaseLayout },
  props: ["page"],
  computed: {
    rage() {
      this.page.title = `Posts tagged with: ${this.page.tag}`;
      return this.page;
    },
  },
};
</script>
