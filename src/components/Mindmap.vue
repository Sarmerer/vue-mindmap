<template>
  <div class="mindmap">
    <EmojiBar v-bind="{ tree }" />
    <HotkeysModal v-bind="{ tree }" />

    <Toolbar v-bind="{ tree }" />
    <TreeR v-bind="{ tree }" />
    <StatusBar v-bind="{ tree }" />
  </div>
</template>

<script>
import { Tree } from "../types/tree";
import { LocalStorage } from "../types/database/localstorage";
import actions from "../actions";

import EmojiBar from "./EmojiBar.r.vue";
import HotkeysModal from "./modals/Hotkeys.vue";
import Toolbar from "./Toolbar.r.vue";
import TreeR from "./Tree.r.vue";
import StatusBar from "./StatusBar.vue";

export default {
  components: {
    EmojiBar,
    HotkeysModal,
    Toolbar,
    TreeR,
    StatusBar,
  },

  data() {
    return {
      tree: new Tree(),
    };
  },

  created() {
    this.tree.actionsManager.addActions(...actions);

    this.tree.setDatabase(new LocalStorage());
    this.tree.deserialize(this.tree.database.readTree("last"));

    window.addEventListener("beforeunload", () => {
      this.tree.database.writeTree("last", this.tree.serialize());
    });

    this.$nextTick(() => {
      this.tree.renderer.render();
    });
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
