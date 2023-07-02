import Vue from "vue";
import App from "./App.vue";

import { BootstrapVueIcons } from "bootstrap-vue";

Vue.use(BootstrapVueIcons);

loadBaseComponents();

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");

function loadBaseComponents() {
  const components = import.meta.globEager("./components/base/*.vue");

  for (const [path, module] of Object.entries(components)) {
    const name = "Base" + path.replace(/^.+\/([^/]+)\.vue/, "$1");
    Vue.component(name, module.default);
  }
}
