<template>
  <div class="board">
    <div class="row" v-for="row in board">
      <div class="space" v-for="space in row">
        <div v-if="space === 0" class="emptySpace"></div>
        <div v-if="space === 1" class="black stone"></div>
        <div v-if="space === 2" class="white stone"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board {
  padding: 8px;
  background: #e0c680;
  display: inline-block;
}
.row {
  background:
      linear-gradient(black,black) 0 calc(50%)/100% 1px no-repeat;
  display: flex;
}
.space {
  background:
      linear-gradient(black,black) 0 calc(50%)/100% 1px no-repeat;
  transform: rotate(90deg);
  padding: 1px;
}
.emptySpace {
  content: " ";
  width: 20px;
  height: 20px;
}
.stone {
  content: " ";
  width: 20px;
  height: 20px;
  background: black;
  border-radius: 50%;
}
.black {
  background: black;
}
.white {
  background: white;
}
</style>

<script>
export default {
  props: {
    board: Array,
  },
};
</script>
