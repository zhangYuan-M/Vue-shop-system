import axios from 'axios'

//导入进度条插件
import NProgress from 'nprogress'
//导入进度条样式
import 'nprogress/nprogress.css'

export function finalRequest(config) {
  const instance = axios.create({
    baseURL: 'http://www.timemeetyou.com:8889/api/private/v1/',
    // baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 10000000
  })
  // 拦截响应, 清理 axios 附带的数据
  instance.interceptors.response.use(
    res => {
      NProgress.done()
      // 也是需要返回数据
      return res.data
    },
    err => {
      console.log(err)
    }
  )
  // 请求拦截，在请求中添加`Authorization`
  instance.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    NProgress.start()
    // console.log(config)
    return config
  })
  // instance axios 实例返回的就是promise实例
  return instance(config)
}