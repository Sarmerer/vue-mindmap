import cascade from '../../modules/effects/cascade'
import { defineSettings } from '../../modules/mindmap/types/settings-manager'

export default defineSettings(
  {
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
  },

  {
    id: 'app.funnyMode',
    label: 'Funny Mode',
    value: false,
    changed() {
      const element = document.activeElement
      if (!element || element.tagName !== 'INPUT') return

      cascade(element.parentNode, 20, [
        '🌵',
        '🌼',
        '🍉',
        '🍄',
        '🍀',
        '🌞',
        '🌙',
        '🎈',
        '🎉',
      ])
    },
  }
)
