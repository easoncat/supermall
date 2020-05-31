module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views',
      }
    }
  }
}
// const path = require('path'); //引入path模块
// function resolve(dir) {
//   return path.join(__dirname, dir) //path.join(__dirname)设置绝对路径
// }
// module.exports = {
//   chainWebpack:(config) => {
//     config.resolve.alias.set('@', resolve('./src'))
//     .set('components', resolve('./src/components'))
//     .set('assets', resolve('./src/assets'))
//     .set('common', resolve('./src/common'))
//     .set('views', resolve('./src/views'))
//   }
// }