import Vue from "vue";
import App from "./App.vue";

import VueMindmap from "vue-mindmap";

import "vue-mindmap/dist/vue-mindmap.css";

Vue.use(VueMindmap);

import { Init } from "@/hotkeys";
Init();

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
