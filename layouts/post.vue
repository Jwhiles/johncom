<template>
  <BaseLayout :page="page">
    <slot name="default" />
  </BaseLayout>
</template>

<script>
import BaseLayout from '../components/BaseLayout.vue'
export default {
  components: { BaseLayout },
  props: ["page"]
};
</script>

<style>
.body {
  max-width: 800px;
  font-size: 18px;
  font-family: sans-serif
}
</style>



