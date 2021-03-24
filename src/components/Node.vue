<template>
  <div class="branch">
    <div
      @click="nodeCLick"
      class="content"
      :class="{ highlight: node._gid === tree._lastNode._gid }"
    >
      <div v-if="node.editing">
        <input
          class="node-name"
          type="text"
          v-model="nodeName"
          :placeholder="text"
          :ref="`node#${node._gid}`"
          @click="setName"
        />
      </div>
      <div id="title" v-else>
        <p id="id">#{{ node.id }}:</p>
        <p>{{ node.name || text }}</p>
      </div>
    </div>
    <div class="entry">
      <Node
        v-show="!node.collapsed"
        v-for="child in node.children"
        :key="child.id"
        :node="child"
      />
    </div>
  </div>
</template>
<script>
import { eventBus } from "@/hotkeys";
import { Node as NodeClass, tree } from "@/tree";

export default {
  name: "Node",
  props: {
    node: NodeClass,
  },
  watch: {
    "node.editing": function (value) {
      if (value) this.focusNode();
    },
  },
  computed: {
    text() {
      return `${this.node.children.length ? "parent" : "child"} ${
        this.node.children.length ? (this.node.collapsed ? ">" : "^") : ""
      }`;
    },
  },
  data() {
    return {
      tree: tree,
      nodeName: "",
    };
  },
  created() {
    eventBus.$on("tree-add-sibling", this.setName);
    if (this.node.editing) {
      this.focusNode();
    }
  },
  methods: {
    addSibling() {
      eventBus.$emit("tree-add-sibling");
    },
    addChild() {
      eventBus.$emit("tree-add-child", this.node);
    },
    nodeCLick() {
      if (tree._lastNode._gid === this.node._gid) {
        if (this.node.children) tree.collapseLastNode();
      } else {
        eventBus.$emit("tree-set-last-node", [this.node]);
      }
    },
    setName() {
      this.node.setName(this.nodeName);
    },
    focusNode() {
      this.$nextTick(() => {
        this.$refs[`node#${this.node._gid}`].focus();
      });
    },
  },
};
</script>
<style scoped>
.entry {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
}

.branch {
  display: flex;
  align-items: center;
  position: relative;
  padding: 5px 0 5px 15px;
  box-sizing: border-box;
}

.branch:before {
  content: "";
  border: 1px solid black;
  border-top: none;
  border-left: none;
  width: 16px;
  height: 0;
  position: absolute;
  left: -5px;
}

.branch:not(:only-of-type):after {
  content: "";
  border: 1px solid black;
  border-top: none;
  border-left: none;
  width: 0px;
  height: 100%;
  position: absolute;
  left: -5px;
}

.branch:first-of-type:after {
  top: 50%;
}

.branch:last-of-type:after {
  bottom: 50%;
}

.branch > .content {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
}

.node-name {
  min-width: 1rem;
  max-width: 4rem;
}

#title {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
}

#title > p {
  padding: 0;
  margin: 0;
}

#title > #id {
  opacity: 0.6;
}

button {
  border-radius: 0.2rem;
  border: 1px solid grey;
}

.highlight {
  box-shadow: inset 0 0 0 2px black;
  border-radius: 0.2rem;
}
</style>