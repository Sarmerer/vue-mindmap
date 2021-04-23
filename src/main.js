import Vue from "vue";
import App from "./App.vue";
import { store } from "@/store";

import { Init } from "@/hotkeys";
Init();

import VModal from "vue-js-modal";
Vue.use(VModal, { componentName: "Modal" });

import { ModalPlugin, BootstrapVueIcons } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
Vue.use(BootstrapVueIcons);
Vue.use(ModalPlugin);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  store,
}).$mount("#app");
