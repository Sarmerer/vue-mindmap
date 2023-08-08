<template>
  <div class="tree">
    <NodeContextMenu v-bind="{ tree }" ref="nodeContextMenu" />

    <svg class="links-container">
      <path
        v-for="link in tree.links"
        :key="link.id"
        class="link"
        :d="link.d"></path>
    </svg>

    <div :id="tree.id" class="nodes-container">
      <Node
        v-for="node of tree.getNodes()"
        :key="node.id"
        v-bind="{ node }"
        @contextmenu.native.stop.prevent="showContextMenu" />
    </div>
  </div>
</template>

<script>
import { Tree } from './types/tree'

import NodeContextMenu from './components/NodeContextMenu.vue'
import Node from './components/Node.vue'

export default {
  props: {
    tree: {
      type: Tree,
      required: true,
    },
  },

  components: {
    NodeContextMenu,
    Node,
  },

  methods: {
    showContextMenu(e) {
      e = this.tree.mindmap.canvas.toCanvasSpaceEvent(e)
      this.$refs.nodeContextMenu.show(e)
    },
  },
}
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
