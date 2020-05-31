<template>
  <div id="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    
    <scroll class="content">
      <cart-list></cart-list>
    </scroll>
    
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
import CartList from './childComps/CartList'
import CartBottomBar from './childComps/CartBottomBar'

import NavBar from 'components/common/navbar/NavBar'
import Scroll from 'components/common/scroll/Scroll'

import {mapGetters} from 'vuex'

export default {
  name: 'Cart',
  components: {
    CartList,
    CartBottomBar,
    NavBar,
    Scroll
  },
  computed: {
    //cartLength() {
      // return this.$store.state.cartList.length
      // return this.$store.getters.cartLength // 用了getters代码量并没有减少
    //}
    ...mapGetters([
      'cartLength'
    ])
  }
}
</script>

<style scoped>
  #cart {
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
  }

  .content {
    height: calc(100% - 44px - 49px - 40px);
    overflow: hidden;
  }
  /* .content {
    height: calc(100% - 49px);
    background-color: #fff;
    position: absolute;
    overflow: hidden;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  } */
</style>
