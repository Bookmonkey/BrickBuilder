import Vue from "vue";
import Home from "./views/Home";
import Studios from "./views/Studios";
import Builder from "./views/Builder";

// import store from "./store";

import VueRouter from 'vue-router'
Vue.use(VueRouter);

const routes = [
  { path: '/', component: Home },
  { path: '/studios', component: Studios },
  { path: '/studio/:id', component: Builder },
]


const router = new VueRouter({
  routes
})

const app = new Vue({
  router,
  // store
}).$mount('#app')

