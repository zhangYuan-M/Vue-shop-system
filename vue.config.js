const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  // configureWebpack: {
  // 	resolve: {
  // 		// extensions: []
  // 		alias: {
  // 			// '@': 'src'
  // 			'assets': '@/assets',
  // 			'common': '@/common',
  // 			'components': '@/components',
  // 			'network': '@/network',
  // 			'views': '@/views',
  // 		}
  // 	}
  // },
  chainWebpack: config => {
    // 配置文件路径
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('network', resolve('src/network'))
      .set('common', resolve('src/common'))
      .set('views', resolve('src/views'))

    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      //entry找到默认的打包入口，调用clear则是删除默认的打包入口
      //add添加新的打包入口
      config.entry('app').clear().add('./src/main-prod.js')

      //使用externals设置排除项
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })

      //使用插件
      config.plugin('html').tap(args => {
        //添加参数isProd
        args[0].isProd = true
        return args
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')

      //使用插件
      config.plugin('html').tap(args => {
        //添加参数isProd
        args[0].isProd = false
        return args
      })
    })
  },
}