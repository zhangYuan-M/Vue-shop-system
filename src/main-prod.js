import Vue from 'vue'
import App from './App.vue'
import router from './router' // 默认会寻找index.js 文件

/* 1.导入elemnet-ui第三方库 */
// import './plugins/element.js'

/* 2.导入阿里图标库 */
import './assets/fonts/iconfont.css'

/* 3.导入富文本编辑器 */
import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor)

/* 4, 导入树形表格控件 */
import Table from 'vue-table-with-tree-grid'
Vue.use(Table)

/* 5.导入echar报表 */
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

/* 6.在network中使用nprogress 依赖 */

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')