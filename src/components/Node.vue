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
import { getBoxToBoxArrow } from "perfect-arrows";

export default {
  name: "Node",
  props: {
    node: NodeClass,
  },
  watch: {
    "node.editing": function(value) {
      if (value) this.focusNode();
    },
    "position.top": function(newVal) {
      console.log(this.node._gid, newVal);
    },
  },

  computed: {
    text() {
      return `${this.node.children.length ? "parent" : "child"} ${
        this.node.children.length ? (this.node.collapsed ? ">" : "^") : ""
      }`;
    },
    position() {
      return this.node?.el?.querySelector(".content")?.getBoundingClientRect();
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
  mounted() {
    this.node.el = this.$el;
    if (this.node.parent) {
      const from = this.node.parent.el
        .querySelector(".content")
        .getBoundingClientRect();
      const to = this.node.el.querySelector(".content").getBoundingClientRect();

      const arrow = getBoxToBoxArrow(
        from.left,
        from.top,
        from.width,
        from.height,
        to.left,
        to.top,
        to.width,
        to.height
      );

      const [sx, sy, cx, cy, ex, ey, ae] = arrow;

      const path = `M${sx},${sy} Q${cx},${cy} ${ex},${ey}`;
      const transform = `translate(${ex},${ey}) rotate(${ae *
        (180 / Math.PI)})`;
      tree.addArrow({ path, transform });
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
