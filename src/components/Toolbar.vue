<template>
  <div>
    <HotkeysModal />

    <documents-list></documents-list>
    <import-export-modal :tab="'f'"></import-export-modal>
    <div class="toolbar">
      <div class="left-buttons">
        <div
          v-for="(action, index) in actions"
          :key="index"
          :title="action.title"
        >
          <button
            v-if="condSatisfied(action)"
            @click.stop="emitEvent(action.event)"
          >
            <b-icon :icon="action.icon"></b-icon>
          </button>
        </div>
      </div>
      <div class="right-buttons">
        <button @click="deleteAllCards" title="Delete All Cards">
          <b-icon icon="x"></b-icon>
        </button>
        <button @click="spawnCard" title="New Card">
          <b-icon icon="file-post"></b-icon>
        </button>
        <button
          class="doc-export"
          @click="toggleImportExportModal('export')"
          title="Export"
        >
          <b-icon icon="upload"></b-icon>
        </button>
        <button
          class="doc-import"
          @click="toggleImportExportModal('import')"
          title="Import"
        >
          <b-icon icon="download"></b-icon>
        </button>
        <button @click.stop="toggleDocMenu" title="Documents">
          <b-icon icon="file-earmark-text"></b-icon>
        </button>
        <button @click="toggleEmojiBar" title="Emoji">
          <b-icon icon="emoji-smile"></b-icon>
        </button>
        <button @click="$modal.show('info-modal')" title="Help">
          <b-icon icon="question"></b-icon>
        </button>
      </div>
    </div>
    <emoji-bar class="emoji-bar" ref="emojiBar"></emoji-bar>
  </div>
</template>
<script>
import ImportExportModal from "./modals/ImportExport.vue";
import DocumentsList from "@/components/modals/DocumentsList";
import HotkeysModal from "./modals/Hotkeys.vue";
import EmojiBar from "@/components/EmojiBar";

import { mapMutations } from "vuex";
import { tree } from "@/tree";
import { eventBus, events } from "@/hotkeys";
import { Card } from "@/card";

export default {
  name: "Toolbar",
  components: {
    EmojiBar,
    HotkeysModal,
    DocumentsList,
    ImportExportModal,
  },
  data() {
    return {
      tree,
      events,
      actions: [
        { title: "Add child", icon: "diagram2", event: "tree-add-child" },
        {
          title: "Add sibling",
          icon: "node-plus",
          event: "tree-add-sibling",
        },
        {
          title: "Collapse",
          cond: () => tree.lastNode.collapsible,
          icon: "arrows-collapse",
          event: "tree-node-collapse",
        },
        {
          title: "Expand",
          cond: () => tree.lastNode.expandable,
          icon: "arrows-expand",
          event: "tree-node-collapse",
        },
        { title: "Edit", icon: "pencil", event: "tree-node-edit" },
        {
          title: "Drill down",
          cond: () => tree.lastNode.canDrillDown,
          icon: "arrow-bar-down",
          event: "tree-push-root",
        },
        {
          title: "Drill up",
          cond: () => tree.lastNode.canDrillUp,
          icon: "arrow-bar-up",
          event: "tree-pop-root",
        },
        {
          title: "Mark done",
          icon: "check2",
          event: "tree-node-toggle-done",
        },
        {
          title: "Do all children",
          cond: () => tree.lastNode.childrenLength > 0,
          icon: "check2-square",
          event: "tree-node-do-all-children",
        },
        {
          title: "Undo all children",
          cond: () => tree.lastNode.childrenLength > 0,
          icon: "x-square",
          event: "tree-node-undo-all-children",
        },
      ],
    };
  },

  methods: {
    ...mapMutations(["addCard", "deleteAllCards"]),
    emitEvent(event) {
      if (!event) return;
      eventBus.$emit(event);
    },

    condSatisfied(action) {
      if (!action.cond) return true;
      return typeof action.cond === "function"
        ? action.cond()
        : action.cond == false
        ? false
        : true;
    },
    toggleEmojiBar() {
      this.$refs?.emojiBar?.toggle();
    },
    toggleDocMenu() {
      this.$modal.show("docs-modal");
    },
    toggleImportExportModal(tab) {
      this.$modal.show("import-export-modal", tab);
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
