import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutations-types'

export default {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      // payload新添加的商品，这是一个对象数组 [{}, {}, {}]
      // 1. 查找数组中是否有该商品
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid);

      // 2. 判断oldProduct
      if (oldProduct) {
        // oldProduct.count += 1;
        context.commit(ADD_COUNTER, oldProduct);
        resolve('当前的商品数量+1')
      } else {
        payload.count = 1;
        // context.commit.cartList.push(payload);
        context.commit(ADD_TO_CART, payload);
        resolve('添加了新的商品')
      }
    })
  }
}