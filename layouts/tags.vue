<template>
  <BaseLayout :page="page">
    <div>
      <slot name="default" />

      <ul>
        <li v-for="tag in allTags" :key="tag.permalink">
          <a :href="tag.permalink">
            {{ tag.name }}
          </a>
          - <span>{{ tag.count }}</span>
        </li>
      </ul>

      <a :href="page.pagination.prevLink" v-if="page.pagination.hasPrev">
        ← Prev Page
      </a>
      <a :href="page.pagination.nextLink" v-if="page.pagination.hasNext">
        Next Page →
      </a>
    </div>
  </BaseLayout>
</template>

<script>
import BaseLayout from "@/components/BaseLayout.vue";
export default {
  components: { BaseLayout },
  props: ["page"],
  computed: {
    allTags() {
      const tags = this.page.posts.reduce((all, post) => {
        post.tagsInfo?.forEach(({ name, permalink }) => {
          if (all[permalink]) {
            all[permalink].count += 1;
          } else {
            all[permalink] = { name, permalink, count: 1 };
          }
        });

        return all;
      }, {});
      return Object.values(tags).sort((a, b) => b.count - a.count);
    },
  },
};
</script>
