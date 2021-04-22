<template>
  <div>
    <modal name="info-modal" :adaptive="true" height="auto" width="500px">
      <div id="modal">
        <table class="info-table">
          <tr v-for="(e, index) in events" :key="index" class="info-row">
            <td class="info-col-action">
              {{ e.name }}
            </td>
            <td class="info-col-hotkey">
              {{ e.hotkey.join(" / ") }}
            </td>
          </tr>
        </table>
      </div>
    </modal>
    <breadcrumb></breadcrumb>
    <div class="toolbar">
      <div class="left-buttons">
        <div v-for="(action, index) in actions" :key="index">
          <button
            v-if="condSatisfied(action)"
            @click.stop="emitEvent(action.event)"
          >
            <b-icon :icon="action.icon"></b-icon>
          </button>
        </div>
      </div>
      <div class="right-buttons">
        <documents-list></documents-list>
        <button @click="toggleEmojiBar">
          <b-icon icon="emoji-smile"></b-icon>
        </button>
        <button @click="$modal.show('info-modal')">
          <b-icon icon="question"></b-icon>
        </button>
      </div>
    </div>
    <emoji-bar class="emoji-bar" ref="emojiBar"></emoji-bar>
  </div>
</template>
<script>
import DocumentsList from "@/components/DocumentsList";
import Breadcrumb from "@/components/Breadcrumb";
import EmojiBar from "@/components/EmojiBar";

import { tree } from "@/tree";
import { eventBus, events } from "@/hotkeys";

export default {
  name: "Toolbar",
  components: {
    DocumentsList,
    Breadcrumb,
    EmojiBar,
  },
  data() {
    return {
      tree,
      events,
      actions: [
        { icon: "diagram2", event: "tree-add-child" },
        { icon: "node-plus", event: "tree-add-sibling" },
        {
          cond: () => tree.lastNode.collapsible,
          icon: "arrows-collapse",
          event: "tree-node-collapse",
        },
        {
          cond: () => tree.lastNode.expandable,
          icon: "arrows-expand",
          event: "tree-node-collapse",
        },
        { icon: "pencil", event: "tree-node-edit" },
        {
          cond: () => tree.lastNode.canDrillDown,
          icon: "arrow-bar-down",
          event: "tree-push-root",
        },
        {
          cond: () => tree.lastNode.canDrillUp,
          icon: "arrow-bar-up",
          event: "tree-pop-root",
        },
        { icon: "check2", event: "tree-node-toggle-done" },
        { icon: "check2-all", event: "tree-node-do-all-children" },
        { icon: "x", event: "tree-node-undo-all-children" },
      ],
    };
  },
  methods: {
    emitEvent(event) {
      if (!event) return;
      eventBus.$emit(event);
    },
    toggleEmojiBar() {
      this.$refs?.emojiBar?.toggle();
    },
    condSatisfied(action) {
      if (!action.cond) return true;
      return typeof action.cond === "function"
        ? action.cond()
        : action.cond == false
        ? false
        : true;
    },
  },
};
</script>
<style lang="scss" scoped>
.toolbar {
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: fit-content;

  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0.5rem;
  z-index: 10;
  background-color: white;
  box-sizing: border-box;
  box-shadow: 0px -2px 5px 0px black;

  .left-buttons {
    display: flex;
    flex-wrap: wrap;
    max-width: 50%;

    button {
      padding: 0;
      border-radius: 0;
      height: 1.7rem;
      width: 1.7rem;
    }
  }

  .right-buttons {
    display: flex;
    gap: 1rem;
  }
}

.emoji-bar {
  box-shadow: 2px -2px 5px 0px black;
}

::v-deep button {
  padding: 0.5rem;
  border-radius: 0.4rem;
  border: none;
  z-index: 1;
  color: black;
  background-color: var(--node-bg-clr);
  box-shadow: 0px 0px 5px -2px black;
}

::v-deep button:active {
  top: 1.07rem;
  background-color: var(--primary-clr);
  box-shadow: 0px 0px 4px -2px black;
  border: none;
}

::v-deep button:focus {
  background-color: var(--primary-clr);
  outline: none;
}
</style>
<style lang="scss" scoped>
#modal {
  padding: 1rem;
  user-select: none;
  z-index: 1;
  pointer-events: none;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
}

.info-row:nth-child(odd) {
  background-color: rgba(167, 167, 167, 0.408);
}

.info-row > td {
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  border: 1px solid black;
}

.info-col-action {
  width: 50%;
  padding-right: 1rem;
  text-align: right;
}

.info-col-hotkey {
  width: 50%;
  padding-left: 1rem;
  text-align: left;
}
</style>
