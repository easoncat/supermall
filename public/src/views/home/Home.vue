<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']" 
        @tabClick="tabClick"
        ref="tabControl1" class="tab-control" v-show="isTabFixed"></tab-control>
    
    <scroll class="content" 
    ref="scroll" 
    :probe-type="3" 
    @scroll="contentScroll" 
    :pull-up-load="true" 
    @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad='swiperImageLoad'></home-swiper>
      <home-recommend-view :recommends="recommends"></home-recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行', '新款', '精选']" 
        @tabClick="tabClick"
        ref="tabControl2"></tab-control>
      <!-- <goods-list :goods="goods[currentType].list"></goods-list> -->
      <goods-list :goods="showGoods"></goods-list>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
// import Swiper from 'components/common/swiper/Swiper'
// import NavBar from 'components/common/swiper/SwiperItem'
import HomeSwiper from './childComps/HomeSwiper'
import HomeRecommendView from './childComps/HomeRecommendView'
import FeatureView from './childComps/FeatureView'


import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'

import {getHomeMultidata, getHomeGoods} from 'network/home'
import {debounce} from 'common/utils'
import {itemListenerMixin, backTopMixin} from 'common/mixin.js'

export default {
  name: 'Home',
  components: {
    HomeSwiper,
    HomeRecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll
  },
  mixins: [itemListenerMixin, backTopMixin],
  data(){
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list:[]},
        'new': {page: 0, list:[]},
        'sell': {page: 0, list:[]}
      },
      currentType: 'pop',
      isTabFixed: false,
      tabOffsetTop: 0,
      saveY: 0,
      // itemImgListener: null
    }
  },
  created() {
    // 1. 请求多个数据
    this.getHomeMultidata()
    // 2. 请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
    
  },
  mounted () {
    // 1. 监听item中图片加载完成
    // const refresh = debounce(this.$refs.scroll.refresh, 500)
    // 第一次没有timer，执行下面的代码，定时器中的func就是 this.$refs.scroll.refresh
    // 会延迟500ms执行这个函数，在延迟过程中，第二次执行这个函数
    // 此时timer不为空，然后会清空这个timer
    // 其实就是延时器不断地被更新
    
    // 监听事件的保存
    // this.itemImgListener = () => {
    //   refresh()
    // }
    
    // this.$bus.$on('itemImageLoad', this.itemImgListener)

    // this.$bus.$on('itemImageLoad', () => {
    //   refresh() // 这是个闭包，对上面 refresh 变量有一个引用，所以这个变量不会被销毁
    //   // refresh('11111', '222222')
    //   // this.$refs.scroll.refresh()
    // })

    // 2. 获取tabControl 的 offsetTop,应该在轮播图加载完成后再获取这个距离
    // 所有组件都有一个属性 $el: 用于获取组件中的元素
    // this.$refs.tabControl2.$el.offsetTop
  },
  methods: {
    // 事件监听
    tabClick(index) {
      switch(index) {
        case 0:
          this.currentType = 'pop'
          break;
        case 1:
          this.currentType = 'new'
          break;
        case 2: 
          this.currentType = 'sell'
          break
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    contentScroll(position) {
      // 1. 判断BackTop是否显示
      this.isShowBackTop = -position.y > 1000

      // 2. 决定tabControl 是否吸顶(position: fixed)
      this.isTabFixed = -position.y > this.tabOffsetTop
    },
    loadMore() {
      this.getHomeGoods(this.currentType);

      // this.$refs.scroll.scroll.refresh()
    },
    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },

    // 网络请求
    getHomeMultidata() {
      getHomeMultidata().then(res => {
      // console.log(res)
      // this.result = res
      this.banners = res.data.banner.list
      this.recommends = res.data.recommend.list
    })
      // console.log(this.result)
    },

    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list);
        // this.goods[type].list.concat(res.data.list)
        this.goods[type].page += 1
        
        // 完成上拉加载更多
        this.$refs.scroll.finishPullUp()
      }) 
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  activated () {
    this.$refs.scroll.refresh()
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
  },
  deactivated () {
    // 1. 保存y值
    this.saveY = this.$refs.scroll.getScrollY()

    // 2. 取消全局事件的监听
    this.$bus.$off('itemImageLoad', this.itemImgListener)
  }
}
</script>

<style scoped>
  #home {
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
  }
  
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /* 在使用浏览器原生滚动时，为了让导航不跟随一起滚动 */
    /* position: fixed;
    top: 0;
    left: 0;
    right: 0; */
    /* z-index: 9; */
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }
  .content {
    position: absolute;
    overflow: hidden;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .fixed {
    position: absolute;
    top: 44px;
    left: 0;
    right: 0;
  }
</style>
