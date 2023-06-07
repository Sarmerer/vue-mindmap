<template>
    <div>
      <modal name="info-modal" :adaptive="true" height="auto" width="500px">
        <div id="modal">
          <table class="info-table">
            <tr v-for="(e, index) in events" :key="index" class="info-row">
              <td class="info-col-action" v-text="e.title"></td>
              <td class="info-col-hotkey" v-text="e.hotkey.join(' / ')"></td>
            </tr>
          </table>
        </div>
      </modal>
  
      <documents-list></documents-list>
      <import-export-modal :tab="'f'"></import-export-modal>
  
      <div class="toolbar">
        <div class="left-buttons">
          <div
            v-for="(action, index) in satisfiedActions"
            :key="index"
            :title="action.title"
          >
            <button @click.stop="action.run($event)">
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
  import ImportExportModal from "@/components/ImportExportModal";
  import DocumentsList from "@/components/DocumentsList";
  import EmojiBar from "@/components/EmojiBar";
  
  import { mapMutations } from "vuex";
  import { eventBus, events } from "@/hotkeys";
  import { Card } from "@/card";
  import { Tree } from "../tree.r";
  
  export default {
    name: "Toolbar",
  
    props: {
      tree: {
        type: Tree,
        required: true,
      },
    },
  
    components: {
      DocumentsList,
  
      EmojiBar,
      ImportExportModal,
    },
  
    data() {
      return {
        events,
        actions: [
          {
            title: "Add child",
            icon: "diagram2",
            run: () => {
              this.tree.activeNode?.addChild();
            },
          },
          {
            title: "Add sibling",
            icon: "node-plus",
            run: () => {
              console.log(this);
              this.tree.activeNode?.addSibling();
            },
          },
          {
            title: "Collapse",
            cond: () => this.tree.activeNode?.children.size,
            icon: "arrows-collapse",
            run: () => {
              this.tree.activeNode?.isCollapsed.set(true);
            },
          },
          {
            title: "Expand",
            cond: () => this.tree.activeNode?.isCollapsed,
            icon: "arrows-expand",
            run: () => {
              this.tree.activeNode?.isCollapsed.set(false);
            },
          },
          { title: "Edit", icon: "pencil", event: "tree-node-edit" },
          {
            title: "Drill down",
            cond: () => !this.tree.activeNode?.isRoot,
            icon: "arrow-bar-down",
            event: "tree-push-root",
          },
          {
            title: "Drill up",
            cond: () => this.tree.activeNode?.isRoot,
            icon: "arrow-bar-up",
            event: "tree-pop-root",
          },
          {
            title: "Mark done",
            icon: "check2",
            run: () => {
              this.tree.activeNode?.isCompleted.set(true);
            },
          },
          {
            title: "Do all children",
            cond: () => this.tree.activeNode?.children.size > 0,
            icon: "check2-square",
            run: () => {
              this.tree.activeNode?.isCompleted.set(true, true);
            },
          },
          {
            title: "Undo all children",
            cond: () => this.tree.activeNode?.children.size > 0,
            icon: "x-square",
            run: () => {
              this.tree.activeNode?.isCompleted.set(false, true);
            },
          },
        ],
      };
    },
  
    computed: {
      satisfiedActions() {
        return this.actions.filter((action) => {
          if (typeof action.cond !== "function") return true;
          return action.cond();
        });
      },
    },
  
    methods: {
      ...mapMutations(["addCard", "deleteAllCards"]),
      emitEvent(event) {
        if (!event) return;
        eventBus.$emit(event);
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
  <style lang="scss" scoped>
  #modal {
    z-index: 1;
    padding: 1rem;
    pointer-events: none;
    user-select: none;
  }
  
  .info-table {
    border-collapse: collapse;
    width: 100%;
  }
  
  .info-row:nth-child(odd) {
    background-color: rgba(167, 167, 167, 0.408);
  }
  
  .info-row > td {
    border: 1px solid black;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
  }
  
  .info-col-action {
    padding-right: 1rem;
    width: 50%;
    text-align: right;
  }
  
  .info-col-hotkey {
    padding-left: 1rem;
    width: 50%;
    text-align: left;
  }
  </style>
  