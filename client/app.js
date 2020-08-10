import Vue from "vue";
import Home from "./views/Home";
import About from "./views/About";
import Creations from "./views/Creations";
import Studios from "./views/Studios";
import Builder from "./views/Builder";

// import store from "./store";

import VueRouter from 'vue-router'
Vue.use(VueRouter);

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/creations', component: Creations },
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

