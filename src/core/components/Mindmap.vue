<template>
  <div class="mindmap">
    <TreesModal v-bind="{ tree }" />
    <TransferModal v-bind="{ tree }" />
    <HotkeysModal v-bind="{ tree }" />
    <MigrateModal v-bind="{ tree }" />

    <Toolbar v-bind="{ tree }" />
    <EmojiBar v-bind="{ tree }" />

    <NotebookRenderer v-bind="{ notebook }" />
    <TreeR v-bind="{ tree }" />

    <StatusBar v-bind="{ tree }" />
  </div>
</template>

<script>
import { Tree } from "../../modules/tree/types/tree";
import { LocalStorage } from "../types/database/localstorage";
import { Notebook } from "../../modules/notebook/types/notebook";
import actions from "../actions";

import TreesModal from "./modals/Trees.vue";
import TransferModal from "./modals/Transfer.vue";
import HotkeysModal from "./modals/Hotkeys.vue";
import MigrateModal from "./modals/Migrate.vue";

import Toolbar from "./Toolbar.r.vue";
import EmojiBar from "./EmojiBar.r.vue";

import NotebookRenderer from "../../modules/Notebook";
import TreeR from "../../modules/tree/index.vue";

import StatusBar from "./StatusBar.vue";

export default {
  components: {
    TreesModal,
    TransferModal,
    HotkeysModal,
    MigrateModal,

    Toolbar,
    EmojiBar,

    NotebookRenderer,
    TreeR,

    StatusBar,
  },

  data() {
    return {
      tree: null,
      notebook: null,
    };
  },

  created() {
    const tree = new Tree();
    tree.setDatabase(new LocalStorage());

    const lastTree = tree.database.getLastTreeId();
    if (lastTree) {
      tree.deserialize(tree.database.getTree(lastTree));
    }

    window.addEventListener("beforeunload", () => {
      tree.database.setTree(tree.id, tree.serialize());
      tree.database.setLastTreeId(tree.id);
    });

    tree.actionsManager.addActions(...actions);
    tree.renderer.render();

    this.tree = tree;

    this.notebook = new Notebook();
  },
};
</script>

<style scoped>
.mindmap {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
