<template>
  <div class="tree">
    <NodeContextMenu v-bind="{ tree }" ref="nodeContextMenu" />

    <Canvas>
      <svg class="links-container">
        <path
          v-for="link in tree.links"
          :key="link.id"
          class="link"
          :d="link.d"
        ></path>
      </svg>

      <div class="nodes-container">
        <NodeRenderer
          v-for="node of tree.getNodes()"
          :key="node.id"
          v-bind="{ node }"
          @contextmenu="showContextMenu"
        />
      </div>
    </Canvas>
  </div>
</template>

<script>
import { Tree } from "../tree.r";

import Canvas from "./Canvas.vue";
import NodeRenderer from "./Node.vue";
import NodeContextMenu from "./NodeContextMenu.vue";

export default {
  props: {
    tree: {
      type: Tree,
      required: true,
    },
  },

  components: {
    NodeContextMenu,
    NodeRenderer,
    Canvas,
  },

  methods: {
    showContextMenu(e) {
      this.$refs.nodeContextMenu.show(e);
    },
  },
};
</script>

<style scoped>
.tree {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.links-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.link {
  stroke-width: 0.5px;
  stroke: black;
  fill: transparent;
}

.nodes-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
