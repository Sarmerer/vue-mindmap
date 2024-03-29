<template>
  <BaseModal ref="modal">
    <table class="hotkeys">
      <tr v-for="(action, index) in actions" :key="index" class="row">
        <td class="action" v-text="action.label"></td>
        <div class="action-hotkeys">
          <kbd
            v-for="(hotkey, index) in action.hotkeys"
            :key="index"
            class="hotkey"
            v-text="formatHotkey(hotkey)">
          </kbd>
        </div>
      </tr>
    </table>
  </BaseModal>
</template>

<script>
import { Tree } from '../../../tree'

export default {
  props: {
    tree: {
      type: Tree,
      required: true,
    },
  },

  computed: {
    actions() {
      const actions = []
      for (const action of this.tree.actions.actions) {
        if (!action.hotkeys.length) continue

        actions.push(action)
      }

      return actions
    },
  },

  created() {
    this.tree.actions.addAction({
      id: 'help',
      toolbarGroupId: 'right',
      toolbarOrder: 5,
      label: 'Show hotkeys',
      icon: 'help-circle',
      hotkeys: ['?', 'f1'],
      run: () => {
        this.$refs.modal.open()
      },
    })
  },

  methods: {
    formatHotkey(hotkey) {
      const symbols = {
        arrowup: '↑',
        arrowright: '→',
        arrowdown: '↓',
        arrowleft: '←',
      }

      return hotkey
        .split('+')
        .map(
          (key) =>
            symbols[key.toLowerCase()] ||
            [key[0].toUpperCase(), key.slice(1)].join('')
        )
        .join(' + ')
    },
  },
}
</script>

<style scoped>
.hotkeys {
  width: 100%;
  height: 100%;
}

.hotkeys .row {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-dialog-border);
  padding: 4px 12px;
  min-width: 300px;
}

.hotkeys .row:last-child {
  border-bottom: none;
}

.hotkeys .action {
  color: var(--color-dialog-text);
  font-weight: bold;
  font-size: 16px;
}

.hotkeys .hotkey {
  margin-left: 4px;
  border: 1px solid var(--color-dialog-border);
  border-radius: 3px;
  background-color: var(--color-dialog-foreground);
  padding: 2px 4px;
  color: var(--color-dialog-text);
  font-size: 0.8rem;
  font-family: monospace;
}
</style>
