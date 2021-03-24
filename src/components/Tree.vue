<template>
  <div class="wrapper">
    <h1 id="title">Tree:</h1>
    <div style="display: flex; flex-direction: column; gap: 0.5rem">
      <div style="display: flex; gap: 0.2rem">
        <button @click="addSibling">Add sibling [Enter]</button>
        <button @click="addChild">Add child [Tab]</button>
        <button @click="editLastNode">Edit node [E]</button>
      </div>
      <div style="display: flex; gap: 0.2rem">
        <button @click="collapseLastNode">Collapse [C]</button>
        <button @click="deleteLastNode">Delete node [Backspace]</button>
        <!-- <button @click="goUp">up</button>
        <button @click="goRight">right</button>
        <button @click="goDown">down</button>
        <button @click="goLeft">left</button> -->
      </div>
    </div>
    <mindmap :nodes="nodes" :connections="connections" :key="nodes.length" />

    <!-- <div class="tree">
      <Node id="tree" v-for="node in tree.nodes" :key="node.id" :node="node" />
    </div> -->
  </div>
</template>
<script>
// import Node from "@/components/Node";
import { eventBus } from "@/hotkeys";
import { tree } from "@/tree";

export default {
  components: {
    // Node,
  },
  computed: {
    nodes() {
      console.log(
        tree.nodes.map((n) => ({
          text: n.text,
          fx: n.fx,
          fy: n.fy,
          nodes: n.nodes,
        }))
      );
      return tree.nodes.map((n) => ({
        text: n.text,
        fx: n.fx,
        fy: n.fy,
        nodes: n.nodes,
      }));
    },
  },
  data() {
    return {
      tree: tree,
      connections: [],
    };
  },
  created() {
    eventBus.$on("tree-add-sibling", this.addSibling);
    eventBus.$on("tree-add-child", this.addChild);
    eventBus.$on("tree-set-last-node", (args) => {
      if (args && args[0]) this.setLastNode(args[0]);
    });
    eventBus.$on("tree-node-collapse", this.collapseLastNode);
    eventBus.$on("tree-node-edit", this.editLastNode);

    eventBus.$on("tree-delete-last-node", this.deleteLastNode);
    eventBus.$on("tree-delete-last-level", this.deleteLastLevel);

    eventBus.$on("tree-go-up", this.goUp);
    eventBus.$on("tree-go-down", this.goDown);
    eventBus.$on("tree-go-left", this.goLeft);
    eventBus.$on("tree-go-right", this.goRight);
  },
  methods: {
    addSibling() {
      tree.addSibling();
    },
    addChild() {
      tree.addChild();
    },
    setLastNode(node) {
      tree.lastNode = node;
    },
    editLastNode() {
      tree.editLastNode();
    },
    collapseLastNode() {
      tree.collapseLastNode();
    },
    deleteLastNode() {
      tree.deleteLastNode();
    },

    goUp() {
      tree.goUp();
    },
    goDown() {
      tree.goDown();
    },
    goLeft() {
      tree.goLeft();
    },
    goRight() {
      tree.goRight();
    },
  },
};
</script>
<style scoped>
#title {
  padding: 0;
  margin: 0;
}

.tree {
  position: relative;
}
</style>
