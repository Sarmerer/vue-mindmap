<template>
  <div>
    <HotkeysModal />
    <DocumentsListModal />
    <ImportExportModal />
    <emoji-bar class="emoji-bar" ref="emojiBar"></emoji-bar>

    <div class="toolbar">
      <div class="left-buttons">
        <div
          v-for="action in actions.left"
          :key="action.id"
          :title="action.label"
        >
          <button @click.stop="action.run()">
            <b-icon :icon="action.icon"></b-icon>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { Card } from "@/card";
import { Tree } from "../tree.r";

import HotkeysModal from "./modals/Hotkeys.vue";
import ImportExportModal from "./modals/ImportExport";
import DocumentsListModal from "./modals/DocumentsList";
import EmojiBar from "./EmojiBar";

export default {
  name: "Toolbar",

  props: {
    tree: {
      type: Tree,
      required: true,
    },
  },

  components: {
    EmojiBar,
    HotkeysModal,
    ImportExportModal,
    DocumentsListModal,
  },

  computed: {
    actions() {
      const actions = { left: [], right: [] };

      for (const action of this.tree.actionsManager.actions) {
        if (!action.toolbarGroupId || !action.when()) continue;

        const group = actions[action.toolbarGroupId];
        if (!group) continue;

        group.push(action);
      }

      return actions;
    },
  },

  methods: {
    ...mapMutations(["addCard", "deleteAllCards"]),

    toggleEmojiBar() {
      this.$refs?.emojiBar?.toggle();
    },

    spawnCard(e) {
      this.addCard(
        new Card("", "", {
          editing: true,
          x: e.clientX,
          y: e.clientY,
          dragging: true,
        })
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.toolbar {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  flex-wrap: wrap;
  justify-content: space-between;
  z-index: 10;
  box-sizing: border-box;
  box-shadow: 0px -2px 5px 0px black;
  background-color: white;
  padding: 0.5rem;
  width: 100%;
  height: fit-content;
  overflow: hidden;

  .left-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 1px;
    max-width: 50%;

    button {
      -radius: 0;
      box-shadow: none;
      border: 0.5px solid var(--secondary-clr);
      border-radius: 0;
      padding: 0;
      width: 1.7rem;
      height: 1.7rem;
      height: 1.7rem;
    }
  }

  .right-buttons {
    display: flex;
    gap: 0.8rem;
  }
}

.emoji-bar {
  box-shadow: 2px -2px 5px 0px black;
}

::v-deep button {
  z-index: 1;
  box-shadow: 0px 0px 5px -2px black;
  border: none;
  border-radius: 0.4rem;
  background-color: var(--node-bg-clr);
  padding: 0.5rem;
  color: black;
}

::v-deep button:active {
  top: 1.07rem;
  box-shadow: 0px 0px 4px -2px black;
  border: none;
  background-color: var(--primary-clr);
}

::v-deep button:focus {
  outline: none;
  background-color: var(--primary-clr);
}
</style>
