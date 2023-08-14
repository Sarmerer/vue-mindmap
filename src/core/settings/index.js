import { defineSettings } from '../../modules/mindmap/types/settings-manager'

export default defineSettings({
  id: 'app.theme',
  label: 'Theme',
  value: 'theme-light',
  options: [
    { label: 'Light', value: 'theme-light' },
    { label: 'Dark', value: 'theme-dark' },
  ],

  changed() {
    const options = this.options.map((option) => option.value)
    document.body.classList.remove(...options)
    document.body.classList.add(this.value)
  },
})
