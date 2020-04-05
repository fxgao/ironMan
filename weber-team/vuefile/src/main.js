// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import routerPath from './router/index'
import axios from 'axios'
import 'babel-polyfill'
import VueClipboard from 'vue-clipboard2'

Vue.use(ElementUI)
Vue.use(VueClipboard)

Vue.prototype.$axios = axios
Vue.prototype.Host = '/api'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: routerPath,
  template: '<App/>',
  components: { App }
})
