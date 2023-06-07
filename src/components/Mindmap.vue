<template>
  <div class="mindmap">
    <Toolbar v-bind="{ tree }" />
    <TreeR v-bind="{ tree }" />
  </div>
</template>

<script>
import { Node } from "../node.r";
import { Tree } from "../tree.r";
import { Renderer } from "../renderer";

import Toolbar from "./Toolbar.r.vue";
import TreeR from "./Tree.r.vue";

export default {
  components: {
    TreeR,
    Toolbar,
  },

  data() {
    return {
      tree: new Tree(),
    };
  },

  mounted() {
    const n = new Node(this.tree);
    n.addChild();
    n.addChild();
    const c = n.addChild();
    c.addSibling().addChild().addSibling().addChild();
    this.tree.addNode(n);

    this.$nextTick(() => {
      const r = new Renderer(this.tree);
      r.render();
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
