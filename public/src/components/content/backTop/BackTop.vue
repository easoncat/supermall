<template>
  <div class="back-top">
    <img src="~assets/img/common/top.png" alt="">
  </div>
</template>

<script>
export default {
  name: 'BackTop'
}
</script>

<style scoped>
  .back-top {
    position: absolute;
    right: 8px;
    bottom: 50px;
    cursor: pointer;
  }

  .back-top img{
    width: 43px;
    height: 43px;
  }
</style>
