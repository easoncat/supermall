<template>
  <div class="wrapper" ref="aaa">
    <div>

    </div> 
  </div>
</template>

<script>
import BScroll from 'better-scroll'


export default {
  name: 'Category',
  data() {
    return {
      scroll: null
    }
  },
  mounted () {
    // 不能在 created 中取元素，由于组件还没有挂载模板，拿不到元素
    // console.log(this.$refs.aaa)
    this.scroll = new BScroll(document.querySelector('.wrapper'),{
      probetype: 3,
      pullUpLoad: true
    })

    this.scroll.on('scroll', (position) => {
      console.log(position)
    })
    this.scroll.on('pullingUp', (position) => {
      console.log('上拉加载更多')
    })
  }
}
</script>

<style scoped>
  .wrapper {
    height: 150px;
    overflow: hidden;
  }
</style>