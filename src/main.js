import Vue from "vue";
import App from "./App.vue";

import { Init } from "@/hotkeys";
Init();

import VModal from "vue-js-modal";
Vue.use(VModal, { componentName: "Modal" });

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
