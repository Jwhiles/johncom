<template>
  <BaseLayout :page="page">
    <div>
      <slot name="default" />

      <ul>
        <li v-for="post in page.posts" :key="post.permalink">
          <a :href="post.permalink">
            {{ post.title }}
          </a>
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
import BaseLayout from '../components/BaseLayout.vue'
export default {
  components: { BaseLayout },
  props: ["page"]
};
</script>
