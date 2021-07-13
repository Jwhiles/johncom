<template>
  <nav>
    <ul>
      <li><a rel="nofollow" href="/">Home</a></li>
      <li><a rel="nofollow" href="/about">About</a></li>
      <li><a rel="nofollow" href="/posts">Blog</a></li>
    </ul>
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  height: 30px;
  align-items: center;
  border-bottom: 3px solid #f0f0f0;
}
ul {
  display: flex;
  flex-grow: 1;
  list-style: none;
  /* justify-content: space-between; */
  padding-left: 0;
}
li {
  margin-right: 20px;
}
</style>
