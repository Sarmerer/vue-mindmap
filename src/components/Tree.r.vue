<template>
  <Canvas id="tree" ref="tree">
    <svg id="links-container">
      <path
        v-for="link in tree.links"
        :key="link.id"
        class="link"
        :d="link.d"
      ></path>
    </svg>

    <div id="nodes-container">
      <NodeRenderer
        v-for="node of tree.getNodes()"
        :key="node.id"
        v-bind="{ node }"
        @contextmenu="openNodeMenu(node, $event)"
      />
    </div>
  </Canvas>
</template>

<script>
import { Tree } from "../tree.r";
import Canvas from "./Canvas.vue";
import NodeRenderer from "./Node.vue";

export default {
  props: {
    tree: {
      type: Tree,
      required: true,
    },
  },

  components: {
    NodeRenderer,
    Canvas,
  },
};
</script>

<style scoped>
#links-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.link {
  stroke-width: 1px;
  stroke: black;
  fill: transparent;
}

#nodes-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
