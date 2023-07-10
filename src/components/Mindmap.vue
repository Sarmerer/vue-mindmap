<template>
  <div class="mindmap">
    <TreesModal v-bind="{ tree }" />
    <TransferModal v-bind="{ tree }" />
    <HotkeysModal v-bind="{ tree }" />
    <MigrateModal v-bind="{ tree }" />

    <Toolbar v-bind="{ tree }" />
    <EmojiBar v-bind="{ tree }" />

    <Notebook />
    <TreeR v-bind="{ tree }" />

    <StatusBar v-bind="{ tree }" />
  </div>
</template>

<script>
import { Tree } from "../types/tree";
import { LocalStorage } from "../types/database/localstorage";
import actions from "../actions";

import TreesModal from "./modals/Trees.vue";
import TransferModal from "./modals/Transfer.vue";
import HotkeysModal from "./modals/Hotkeys.vue";
import MigrateModal from "./modals/Migrate.vue";

import Toolbar from "./Toolbar.r.vue";
import EmojiBar from "./EmojiBar.r.vue";

import TreeR from "./Tree.r.vue";

import StatusBar from "./StatusBar.vue";

export default {
  components: {
    TreesModal,
    TransferModal,
    HotkeysModal,
    MigrateModal,

    Toolbar,
    EmojiBar,

    TreeR,

    StatusBar,
  },

  data() {
    return {
      tree: null,
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
