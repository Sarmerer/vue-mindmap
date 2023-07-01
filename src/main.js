import Vue from "vue";
import App from "./App.vue";

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
}).$mount("#app");
