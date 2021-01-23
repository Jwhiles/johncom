<template>
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
</template>

<script>
export default {
  props: ['page']
}
</script><Paste>

