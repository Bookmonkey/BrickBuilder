import Vue from "vue";
import UIView from "./UIView.vue";
import Home from "./views/Home";
import Studios from "./views/Studios";

import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home },
  { path: '/studios', component: Studios },
  { path: '/builder', component: UIView },
]


const router = new VueRouter({
  routes
})

const app = new Vue({router}).$mount('#app');

