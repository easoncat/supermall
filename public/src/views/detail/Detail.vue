<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav-bar" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
      <!-- 属性：topImages 传入值：top-images 标签中不区分大小写，会给topimages传值，但是
      却不存在这个属性，就会产生错误-->
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods='goods'></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommend"></goods-list>
    </scroll>
    <detail-bottom-bar class="bottom-bar" @addCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <toast :message="message" :isShow="isShow"></toast>
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParams'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
import Toast from 'components/common/toast/Toast'

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail.js'
import {debounce} from 'common/utils'
import {itemListenerMixin, backTopMixin} from 'common/mixin.js'

import {mapActions} from 'vuex'

export default {
  name: 'Detail',
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommend: [],
      // itemImgListener: null
      themeTopsYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      isShow: false,
      message: ''
    }
  },
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    Toast
  },
  created () {
    // 1. 保存 iid
    // this.iid = this.$route.params.iid
    this.iid = this.$route.query.iid

    // 2. 根据 iid 请求数据
    getDetail(this.iid).then(res => {
      // 2.1 获取顶部的图片轮播数据
      const data = res.result;
      this.topImages = data.itemInfo.topImages
      // console.log(data)
      // 2.2 获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      // 2.3 获取店铺信息
      this.shop = new Shop(data.shopInfo)

      // 2.4 保存商品详情数据
      this.detailInfo = data.detailInfo

      // 2.5 保存商品参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      // 2.6 取出评论信息
      if(data.rate.cRate != 0) {
        this.commentInfo = data.rate.list[0]
        // console.log(this.commentInfo)
      }

      // this.$nextTick(() => {
      //   // 根据最新的数据，对应的DOM是已经被渲染出来了
      //   // 但是图片依然没有加载完（目前获取到的offsetTop不包含其中的图片）
      //   this.themeTopsYs = []
      //   this.themeTopsYs.push(0)
      //   this.themeTopsYs.push(this.$refs.params.$el.offsetTop)
      //   this.themeTopsYs.push(this.$refs.comment.$el.offsetTop)
      //   this.themeTopsYs.push(this.$refs.recommend.$el.offsetTop)
      //   console.log(this.themeTopsYs)
      // })
    })

    //3. 请求推荐数据
    getRecommend().then(res => {
      this.recommend = res.data.list
    }),

    // 4. 给getThemeTopY 赋值(对this.themeTopYs赋值的操作进行防抖)
    this.getThemeTopY = debounce(() => {
      this.themeTopsYs = []
      this.themeTopsYs.push(0)
      this.themeTopsYs.push(this.$refs.params.$el.offsetTop - 44)
      this.themeTopsYs.push(this.$refs.comment.$el.offsetTop - 44)
      this.themeTopsYs.push(this.$refs.recommend.$el.offsetTop - 44)
      this.themeTopsYs.push(Number.MAX_VALUE)
    },100)

  },
  methods: {
    ...mapActions(['addCart']),
    imageLoad() {
      this.$refs.scroll.refresh()
      this.getThemeTopY()
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopsYs[index], 200)
    },
    contentScroll(position) {
      const positionY = -position.y

      // positionY 和主题中的值进行对比
      // [0, 7900, 9100, 9400, Number.Max]

      //positionY 在 0 和 7900 之间，index = 0
      //positionY 在 7900 和 9100 之间，index = 1
      //positionY 在 9100 和 9400 之间，index = 2
      //positionY 在9400和无穷大之间，index = 3
      let length = this.themeTopsYs.length
      for(let i = 0; i < length - 1; i++) {
        if(this.currentIndex !== i && (positionY >= this.themeTopsYs[i] && positionY < this.themeTopsYs[i+1])) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex
        }


        // if(this.currentIndex !== i && ((i<length - 1 && positionY >= this.themeTopsYs[i] &&
        // positionY < this.themeTopsYs[i + 1]) || (i === length - 1 && positionY >= this.themeTopsYs[i]))) {
        //   this.currentIndex = i;
        //   this.refs.nav.currentIndex = this.currentIndex
        // }

        this.isShowBackTop = -position.y > 1000
      }
    },
    addToCart() {
      // 1. 获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid
      // 2. 将商品添加到购物车中
      // this.$store.commit('addCart', product)

      this.addCart(product).then(res => {
        this.isShow = true
        this.message = res
        setTimeout(() => {
          this.isShow = false,
          this.message = ''
        }, 1500);
      })

      //this.$store.dispatch('addCart', product).then(res => {
        //console.log(res) // 可以显示 '当前商品数量+1'
      //})
    }
  },
  mounted () {
    
  },
  destroyed () {
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  }

}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .content {
    background-color: #fff;
    height: calc(100% - 96px);
    overflow: hidden;
  }

  /* .detail-nav-bar {
    position: relative;
    z-index: 9;
    background-color: #fff;
  } */
</style>
