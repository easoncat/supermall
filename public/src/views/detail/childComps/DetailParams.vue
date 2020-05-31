<template>
  <div class="param-info" v-if="Object.keys(paramInfo).length !== 0">
    <table v-for="(table, index) in paramInfo.sizes" :key="index" class="info-size">
        <tr v-for="(tr, tr_index) in table" :key="tr_index"> 
          <td v-for="(td_item, td_index) in tr" :key="td_index">{{td_item}}</td>
        </tr>
    </table>
    
    <table class="info-param">
      <tr v-for="(item, index) in paramInfo.infos" :key="index">
        <td class="info-param-key">{{ item.key }}</td>
        <td class="param-value">{{ item.value }}</td>
      </tr>
    </table>
    
    <div class="info-img" v-if="paramInfo.image.length !== 0">
      <img :src="paramInfo.image" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailParamInfo',
  props: {
    paramInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  }
};
</script>
<style>

.param-info {
  padding: 20px 15px;
  font-size: 14px;
  border-bottom: 5px solid #f2f5f8;
}

.param-info table {
  width: 100%;
  border-collapse: collapse;
}

.param-info table tr {
  height: 42px;
}

.param-info table tr td {
  border-bottom: 1px solid rgba(100, 100, 100, .1);
}

.info-param-key {
  /* 当value数据量很大时，会挤到key，所以给一个固定宽度 */
  width: 95px;
}

.info-param {
  border-top: 1px solid rgba(0, 0, 0, .1);
}

.param-value {
  color: #eb4868
}

.info-img img {
  width: 100%;
}
</style>
