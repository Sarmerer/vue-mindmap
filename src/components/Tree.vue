<template>
  <div class="wrapper">
    <vue-tree
      style="width: 100%; height: 100%"
      :dataset="tree"
      :config="treeConfig"
      :key="counter"
      direction="horizontal"
    >
      <template v-slot:node="{ node }">
        <div
          :class="{
            highlighted: node._gid === tree.lastNode._gid,
            stack: node.childrenLength && node.collapsed,
          }"
          style="padding: 1rem; border-radius: 0.2rem; background-color: grey; color: white; user-select: none;"
          @click="setLastNode(node)"
        >
          <span v-if="!node.editing" class="tree-node">{{ node.value }} </span>
          <input v-else v-model="node._name" :ref="`node-#${node._gid}`" />
        </div>
      </template>
    </vue-tree>
  </div>
</template>
<script>
// import Node from "@/components/Node";
import VueTree from "@/components/VueTree";
import { eventBus } from "@/hotkeys";
import { tree } from "@/tree";
// import Vue from "vue";

export default {
  components: {
    // Node,
    VueTree,
  },
  data() {
    return {
      tree: tree,
      counter: 0,

      treeConfig: { nodeWidth: 120, nodeHeight: 80, levelHeight: 200 },
    };
  },
  created() {
    eventBus.$on("tree-add-sibling", this.addSibling);
    eventBus.$on("tree-add-child", this.addChild);
    eventBus.$on("tree-set-last-node", (args) => {
      if (args && args[0]) this.setLastNode(args[0]);
    });
    eventBus.$on("tree-node-collapse", this.collapseLastNode);
    eventBus.$on("tree-node-edit", (e) => this.editLastNode(e));

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
      this.updateKey();
      this.$nextTick(() => {
        this.$refs[`node-#${tree.lastNode._gid}`]?.focus();
      });
    },
    addChild() {
      tree.addChild();
      this.updateKey();
      this.$nextTick(() => {
        this.$refs[`node-#${tree.lastNode._gid}`]?.focus();
      });
    },
    setName() {
      tree.lastNode.setName(this.lastNode.name);
      this.updateKey();
    },
    setLastNode(node) {
      if (tree.lastNode._gid === node._gid) return this.collapseLastNode();
      tree.lastNode = node;
    },
    editLastNode(e) {
      if (!tree.lastNode.editing) e?.preventDefault();
      tree.editLastNode();
      this.$nextTick(() => {
        this.$refs[`node-#${tree.lastNode._gid}`]?.focus();
      });
    },
    collapseLastNode() {
      tree.collapseLastNode();
      this.updateKey();
    },
    deleteLastNode() {
      tree.deleteLastNode();
      this.updateKey();
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
    getID(node) {
      return node._gid;
    },
    clickedText(node) {
      this.setLastNode(node.data);
    },
    clickedNode(node) {
      this.setLastNode(node.data);
      tree.collapseLastNode();
    },

    updateKey() {
      this.counter++;
    },
  },
};
</script>
<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
}

#title {
  padding: 0;
  margin: 0;
}

.tree {
  position: relative;
}

.highlighted {
  border: 2px solid black;
  /* box-shadow: inset 0 0 0 2px black; */
}

.stack {
  position: relative;
}

.stack,
.stack::before,
.stack::after {
  box-shadow: 2px 1px 1px rgba(0, 0, 0, 0.15);
}

.stack::before,
.stack::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: grey;
  border-radius: 0.2rem;
}

/* Second sheet of stack */
.stack::before {
  left: 4px;
  top: 4px;
  z-index: -1;
}

/* Third sheet of stack */
.stack::after {
  left: 8px;
  top: 8px;
  z-index: -2;
}
</style>
