import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

function loadBaseComponents() {
  const components = import.meta.globEager('./core/components/base/*.vue')

  for (const [path, module] of Object.entries(components)) {
    const name = 'Base' + path.replace(/^.+\/([^/]+)\.vue/, '$1')
    Vue.component(name, module.default)
  }
}

loadBaseComponents()

new Vue({
  render: (h) => h(App),
}).$mount('#app')
