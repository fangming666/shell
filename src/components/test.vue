<template>
  <div>
    <div class="test" @click.self="test1">
      123
      <span @click="test2">456</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "test",
    methods: {
      test1() {
        console.log(1)
      },
      test2() {
        console.log(2)
      }
    }
  }
</script>

<style scoped>
  .test {
    width: 100px;
    height: 100px;
    border: 1px solid red;
  }

  span {
    background: green;
    margin: 10px;
  }
</style>
