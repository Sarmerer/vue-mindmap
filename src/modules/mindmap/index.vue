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
import { Mindmap } from "../mindmap/types/mindmap";
import { LocalStorage } from "../../core/types/database/localstorage";
import actions from "../../core/actions";

import TreesModal from "./components/modals/Trees.vue";
import TransferModal from "./components/modals/Transfer.vue";
import HotkeysModal from "./components/modals/Hotkeys.vue";
import MigrateModal from "./components/modals/Migrate.vue";

import Toolbar from "./components/Toolbar.r.vue";
import EmojiBar from "./components/EmojiBar.r.vue";

import NotebookRenderer from "../../modules/Notebook";
import TreeR from "../../modules/tree/index.vue";

import StatusBar from "./components/StatusBar.vue";

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
      mindmap: null,
    };
  },

  computed: {
    tree() {
      return this.mindmap.tree;
    },

    notebook() {
      return this.mindmap.notebook;
    },
  },

  created() {
    this.mindmap = new Mindmap();

    const { tree } = this.mindmap;
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
