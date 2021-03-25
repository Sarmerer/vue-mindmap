import Vue from "vue";
import App from "./App.vue";

import { Init } from "@/hotkeys";
Init();

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
