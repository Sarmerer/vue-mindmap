<template>
  <!-- bootstrap vue modal listing all actions -->
  <b-modal ref="modal" hide-header hide-footer>
    <table class="hotkeys">
      <tr v-for="(action, index) in actions" :key="index" class="row">
        <td class="action" v-text="action.label"></td>
        <kbd
          v-for="(hotkey, index) in action.hotkeys"
          :key="index"
          class="hotkey"
        >
          {{ formatHotkey(hotkey) }}
        </kbd>
      </tr>
    </table>
  </b-modal>
</template>

<script>
import { Tree } from "../../types/tree";

export default {
  props: {
    tree: {
      type: Tree,
      required: true,
    },
  },

  computed: {
    actions() {
      const actions = [];
      for (const action of this.tree.actionsManager.actions) {
        if (!action.hotkeys.length) continue;

        actions.push(action);
      }

      return actions;
    },
  },

  created() {
    this.tree.actionsManager.addAction({
      id: "help",
      toolbarGroupId: "right",
      label: "Show hotkeys",
      icon: "question",
      hotkeys: ["?"],
      run: () => {
        this.$refs.modal.show();
      },
    });
  },

  methods: {
    formatHotkey(hotkey) {
      const symbols = {
        arrowup: "↑",
        arrowright: "→",
        arrowdown: "↓",
        arrowleft: "←",
      };

      return hotkey
        .split("+")
        .map(
          (key) =>
            symbols[key.toLowerCase()] ||
            [key[0].toUpperCase(), key.slice(1)].join("")
        )
        .join(" + ");
    },
  },
};
</script>

<style scoped>
.hotkeys {
  width: 100%;
  height: 100%;
}

.hotkeys .row {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #dee2e6;
  padding: 4px 12px;
}

.hotkeys .row:last-child {
  border-bottom: none;
}

.hotkeys .action {
  font-weight: bold;
}

.hotkeys .hotkey {
  margin-left: 4px;
  border: 1px solid #e9ecef;
  border-radius: 3px;
  background-color: #f8f9fa;
  padding: 2px 4px;
  color: #212529;
  font-size: 0.8rem;
  font-family: monospace;
}
</style>
