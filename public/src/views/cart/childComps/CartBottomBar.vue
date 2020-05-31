<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button 
      :is-checked="isSelectAll" 
      class="check-button"
      @click.native='checkClick'></check-button>
      <span>全选</span>
    </div>

    <div class="price">
      合计：{{totalPrice}}
    </div>

    <div class="calculate">
      去计算：{{checkLength}}
    </div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton"

export default {
  name: 'CartBottomBar',
  components: {
    CheckButton
  },
  computed: {
    totalPrice() {
      return '￥' + this.$store.state.cartList.filter(item => {
        return item.checked
      }).reduce((pre, cur) => {
        return pre + cur.price * cur.count
      }, 0).toFixed(2)
    },
    checkLength() {
      return this.$store.state.cartList.filter(item => {
        return item.checked
      }).length
    },
    isSelectAll() {
      // return !(this.$store.state.cartList.filter(item => item.checked).length)
      if(this.$store.state.cartList.length === 0) {
        return false;
      } else {
        return this.$store.state.cartList.every(item => item.checked == true)
      }
      
    }
  },
  methods: {
    checkClick() {
      if(this.isSelectAll) {
        this.$store.state.cartList.forEach(item => item.checked = false)
      } else {
        this.$store.state.cartList.forEach(item => {
          item.checked = true
        })
      }
    }
  }
}
</script>

<style scoped>
  .bottom-bar {
    position: relative;
    display: flex;
    background-color:#fff;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
  }

  .check-content {
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 80px;
  }

  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }

  .price {
    margin-left: 25px;
    flex: 1;
  }

  .calculate {
    width: 90px;
    background: orange;
    color: #fff;
    text-align: center;
  }
</style>
