import Vue from "vue";
import App from "./App.vue";
import { store } from "@/store/index";

import { Init } from "@/hotkeys";
Init();

import {
  ModalPlugin,
  FormTextareaPlugin,
  BootstrapVueIcons,
} from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(BootstrapVueIcons);
Vue.use(ModalPlugin);
Vue.use(FormTextareaPlugin);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  store,
}).$mount("#app");
