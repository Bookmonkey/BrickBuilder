import Vue from "vue";
import UIView from "./UIView.vue";
new Vue({ render: createElement => createElement(UIView) }).$mount('#ui');
