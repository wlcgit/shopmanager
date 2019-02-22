import axios from 'axios'
import { Message } from 'element-ui'
const HttpServer = {}
HttpServer.install = function (Vue) {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

  // 添加请求拦截器
  axios.interceptors.request.use(function (config) {
    console.log('拦截其被触发----')
    if (config.url !== 'login') {
      const AUTH_TOKEN = localStorage.getItem('token')
      // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
      config.headers['Authorization'] = AUTH_TOKEN
    }
    // 在发送请求之前做些什么
    return config
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  })
  // 添加 响应拦截器
  axios.interceptors.response.use(function (response) {
    console.log('res拦截器被触发--')
    console.log(response)
    const {
      meta: {
        status, msg
      }
    } = response.data
    if (status !== 200 && status !== 201) {
      Message.warning(msg)
    }
    return response
  }, function (error) {
    return Promise.reject(error)
  })

  Vue.prototype.$http = axios
}
export default HttpServer
