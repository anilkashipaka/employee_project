import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import {routes} from './routes'

Vue.use(Vuetify)

Vue.use(VueRouter);
const router = new VueRouter({
  mode:'history',
  routes

})
new Vue({
  el: '#app',
  router,
  vuetify: new Vuetify(),
  render: h => h(App)
})
