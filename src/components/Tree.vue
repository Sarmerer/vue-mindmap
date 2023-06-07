<template>
  <div class="wrapper">
    <context-menu ref="contextMenu">
      <template #items>
        <button class="context-menu-item" @click="addSibling">
          <b-icon icon="node-plus"></b-icon>
          Add sibling
        </button>
        <button class="context-menu-item" @click="addChild">
          <b-icon icon="diagram2"></b-icon>
          Add child
        </button>
        <button class="context-menu-item" @click="toggleDone">
          <b-icon :icon="tree.lastNode.done ? 'x' : 'check2'"></b-icon>
          {{ tree.lastNode.done ? "Undo" : "Done" }}
        </button>
        <button
          class="context-menu-item"
          @click="pushRootToQuery"
          v-if="!tree.lastNode.isRoot"
        >
          <b-icon icon="arrow-bar-down"></b-icon>
          Drill down
        </button>
        <button
          v-if="tree.lastNode.childrenLength"
          class="context-menu-item"
          @click="collapseLastNode"
        >
          <b-icon
            :icon="
              tree.lastNode.collapsed ? 'arrows-expand' : 'arrows-collapse'
            "
          ></b-icon>
          {{ tree.lastNode.collapsed ? "Expand" : "Collapse" }}
        </button>
        <button class="context-menu-item" @click="editLastNode">
          <b-icon icon="pencil"></b-icon>
          Edit
        </button>
        <button class="context-menu-selector">
          <b-icon icon="kanban"></b-icon>
          Weight: {{ tree.lastNode.weight || 1 }}
          <ul>
            <li
              v-for="(value, key) in ['Default', 10, 5, 1, -1, -5, -10]"
              :key="key"
              @click="tree.lastNode.addWeight(value)"
            >
              {{ value >= 0 ? `+${value}` : value }}
            </li>
          </ul>
          <b-icon icon="chevron-right" class="arrow"></b-icon>
        </button>
        <button class="context-menu-selector">
          <b-icon icon="gear"></b-icon>
          Settings
          <ul>
            <li
              v-for="(value, key) in tree.lastNode.settings"
              :key="key"
              @click="tree.lastNode.toggleSetting(key)"
            >
              {{ key }}
              <b-icon v-if="value" icon="check2"></b-icon>
            </li>
          </ul>
          <b-icon icon="chevron-right" class="arrow"></b-icon>
        </button>
        <button
          v-if="tree.lastNode.deletable"
          class="context-menu-item"
          @click="deleteLastNode"
        >
          <b-icon icon="node-minus"></b-icon>
          Delete
        </button>
      </template>
    </context-menu>
    <toolbar></toolbar>

    <div
      class="tree-container"
      ref="container"
      :class="{ dragging: nodeDrag.dragging }"
      @mousewheel="handleZoom"
      @click.middle="handleZoom"
    >
      <svg class="svg vue-tree" ref="svg" :style="initialTransformStyle"></svg>

      <div
        class="dom-container"
        ref="domContainer"
        :style="initialTransformStyle"
      >
        <div
          class="node-slot"
          v-for="node of nodeDataList"
          :key="node.data._key"
          :style="{
            left: formatDimension(node.y),
            top: formatDimension(node.x),
          }"
          @dragover.stop="mouseOverNode($event, node)"
          @dragend="onDrop($event, node)"
        >
          <!-- @dragleave="mouseLeaveNode($event, node)" -->
          <div
            class="node-slot-overlay"
            :class="{
              'node-top': nodeDrag.snap === 'top' && isDraggedOver(node.data),
              'node-bottom':
                nodeDrag.snap === 'bottom' && isDraggedOver(node.data),
              'node-right':
                nodeDrag.snap === 'right' && isDraggedOver(node.data),
            }"
          >
            <div
              :ref="`node-${node.data._gid}`"
              :id="`node-${node.data._gid}`"
              class="node"
              :class="{
                dragover: isDraggedOver(node.data),
                highlighted: node.data._gid === tree.lastNode._gid,
                stack: node.data.childrenLength && node.data.collapsed,
                done: node.data.done,
                editing: node.data.editing,
              }"
              @mousedown.stop
              @click="setLastNode(node.data, $event)"
              @contextmenu="nodeContextClick($event, node.data)"
              :draggable="node.data.draggable"
              @dragstart="startDrag($event, node)"
              @drag="onDrag()"
            >
              <div class="content" v-if="!node.data.editing">
                <div
                  v-if="
                    !node.data.editing &&
                    node.data.emoji &&
                    node.data.emoji.length
                  "
                >
                  <span
                    v-for="(emoji, key) in emojifyArray(node.data.emoji)"
                    :key="key"
                    >{{ emoji }}
                  </span>
                </div>
                <pre
                  v-if="!node.data.editing"
                  v-text="node.data.name"
                  @mousewheel.stop
                ></pre>
                <small
                  class="completeness"
                  v-if="!node.data.editing && node.data.totalChildrenTasks > 0"
                  v-text="
                    `${node.data.finishedChildrenTasks}/${node.data.totalChildrenTasks}`
                  "
                ></small>
                <button
                  class="drill-up"
                  v-if="node.data.isRoot && tree.hasQuery"
                  @click.stop="spliceRootsQuery"
                >
                  <b-icon icon="arrow-bar-up"></b-icon>
                </button>

                <div class="progress-wrapper">
                  <div
                    v-if="shouldDisplayProgress(node.data)"
                    class="progress"
                    :class="{ 'round-right': node.data.progress == 100 }"
                    :style="{ width: `${node.data.progress}%` }"
                    :title="`${node.data.progress}%`"
                  >
                    <!-- <span>{{ node.data.progress }}%</span> -->
                  </div>
                </div>
              </div>
              <textarea
                v-if="node.data.editing"
                v-model="node.data._name"
                :ref="`node-#${node.data._gid}`"
                @keydown.esc="quitNodeEditor"
                @keydown.enter.prevent="quitNodeEditor($event, { save: true })"
                @keydown.tab.prevent="
                  quitNodeEditor($event, { save: true, callback: addChild })
                "
                @keydown.exact.stop
                @blur="blurLastNode(node.data)"
                @mousewheel.stop
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
    <breadcrumb></breadcrumb>
    <cards-wrapper></cards-wrapper>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import Breadcrumb from "@/components/Breadcrumb";
import ContextMenu from "@/components/ContextMenu";
import CardsWrapper from "@/components/cards/CardsWrapper";

import * as d3 from "d3";
import { flextree } from "d3-flextree";

import { tree } from "@/tree";
import { events, eventBus } from "@/hotkeys";
import { store } from "@/store/index";
import { mapActions } from "vuex";
import * as emojis from "node-emoji";

const MATCH_TRANSLATE_REGEX = /translate\((-?\d+)px, ?(-?\d+)px\)/i;
const MATCH_SCALE_REGEX = /scale\((\S*)\)/i;

function uuid() {
  const s = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";
  return s.join("");
}

export default {
  name: "Tree",
  components: { Toolbar, ContextMenu, Breadcrumb, CardsWrapper },
  data() {
    return {
      d3,
      events,
      store,
      tree,
      nodeDataList: [],
      linkDataList: [],
      initTransformX: 0,
      initTransformY: 0,
      currentScale: 1,
      nodeDrag: {
        dragging: false,
        source: null,
        target: null,
        snap: "",
      },
      key: 0,
    };
  },
  computed: {
    initialTransformStyle() {
      return {
        transform: `scale(1) translate(${this.initTransformX}px, ${this.initTransformY}px)`,
        transformOrigin: "center",
      };
    },
  },
  created() {
    this.addUniqueKey(this.tree.root);

    eventBus.$on("tree-push-root", this.pushRootToQuery);
    eventBus.$on("tree-pop-root", this.spliceRootsQuery);
    eventBus.$on("tree-add-sibling", this.addSibling);
    eventBus.$on("tree-add-child", this.addChild);
    eventBus.$on("tree-set-last-node", (args) => {
      if (args && args[0]) this.setLastNode(args[0]);
    });
    eventBus.$on("tree-node-toggle-done", this.toggleDone);
    eventBus.$on("tree-node-toggle-emoji", this.toggleEmoji);
    eventBus.$on("tree-node-collapse", this.collapseLastNode);
    eventBus.$on("tree-node-edit", this.editLastNode);
    eventBus.$on("tree-node-do-all-children", this.doAllChildren);
    eventBus.$on("tree-node-undo-all-children", this.undoAllChildren);

    eventBus.$on("tree-delete-last-node", this.deleteLastNode);

    eventBus.$on("tree-go-up", this.goUp);
    eventBus.$on("tree-go-down", this.goDown);
    eventBus.$on("tree-go-left", this.goLeft);
    eventBus.$on("tree-go-right", this.goRight);
    eventBus.$on("document-save", this.saveDocument);
  },
  mounted() {
    this.init();
  },

  beforeDestroy() {
    this.saveDocument();
  },

  methods: {
    ...mapActions({
      saveDocumentAction: "saveDocument",
    }),
    isDraggedOver(node) {
      return (
        this.nodeDrag?.target?.data._gid === node._gid &&
        this.nodeDrag?.source?.data._gid !== node._gid &&
        !node.isRoot
      );
    },
    startDrag(evt, node) {
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";
      node.data.collapsed = true;
      this.nodeDrag.source = node;
    },
    onDrag() {
      this.nodeDrag.dragging = true;
    },
    onDrop(_, node) {
      if (this.nodeDrag.target && this.nodeDrag.target !== node)
        tree.cloneNode(
          node.data,
          this.nodeDrag.target.data,
          this.nodeDrag.snap
        );
      node.collapsed = false;
      this.nodeDrag.dragging = false;
      this.nodeDrag.target = null;
      this.nodeDrag.source = null;
    },
    mouseOverNode(e, node) {
      if (!this.nodeDrag.dragging || node.isRoot) return;
      this.nodeDrag.target = node;
      let rect = e.target.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      let yHalf = rect.height / 2;

      if (x > rect.width - rect.width / 4) {
        this.nodeDrag.snap = "right";
      } else if (y < yHalf) {
        this.nodeDrag.snap = "top";
      } else if (y >= yHalf) {
        this.nodeDrag.snap = "bottom";
      }
    },
    mouseLeaveNode(_, node) {
      if (node.data._gid !== this.nodeDrag?.target?.data._gid) return;
      this.nodeDrag.target = null;
    },
    spliceRootsQuery(n = 1) {
      tree.spliceRootsQuery(n);
    },
    pushRootToQuery() {
      if (tree.lastNode) tree.pushRootToQuery(tree.lastNode);
    },
    sortTree(by, direction) {
      tree.sortLastNode(by, direction);
    },
    addSibling() {
      tree.addSibling();
      this.focusInput(`node-#${tree.lastNode._gid}`);
      // this.saveDocument();
    },
    addChild() {
      tree.addChild();
      this.focusInput(`node-#${tree.lastNode._gid}`);
      // this.saveDocument();
    },
    toggleDone() {
      tree.lastNode.toggleDoneState();
    },
    shouldDisplayProgress(node) {
      return node?.settings?.displayProgress;
    },
    doAllChildren() {
      tree.lastNode.setAllChildrenDoneState(true);
    },
    undoAllChildren() {
      tree.lastNode.setAllChildrenDoneState(false);
    },
    toggleEmoji(emoji) {
      tree.lastNode.toggleEmoji(emoji);
    },
    emojifyArray(array) {
      if (!array?.length) return "";
      return array.map((a) => emojis.get(a));
    },
    setLastNode(node, event) {
      if (event?.which === 1 && tree.lastNode._gid === node._gid)
        return this.collapseLastNode();
      tree.lastNode = node;
      this.$refs?.contextMenu?.close();
    },
    editLastNode() {
      tree.lastNode.editing = true;
      this.focusInput(`node-#${tree.lastNode._gid}`);
      // this.saveDocument();
    },
    blurLastNode(triggerNode) {
      tree.blurLastNode(triggerNode);
    },

    deleteLastNode() {
      tree.deleteLastNode();
      // this.saveDocument();
    },
    quitNodeEditor(e, options = { save: false, callback: null }) {
      if (e.shiftKey) return (tree.lastNode._name += "\n");
      if (tree.lastNode.firstEdit && !options.save) {
        tree.deleteLastNode({ force: true });
      } else {
        tree.lastNode.editing = false;
        tree.lastNode.parseName();
      }
      if (typeof options.callback === "function") options.callback();
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
    clickedText(node) {
      this.setLastNode(node.data);
    },
    clickedNode(node) {
      this.setLastNode(node);
      tree.collapseLastNode();
    },
    focusInput(ref) {
      if (!ref) return;
      this.$nextTick(() => {
        const input = this.$refs[ref];
        if (input && input[0]) input[0].focus();
      });
    },
    saveDocument() {
      this.saveDocumentAction(tree.export());
    },

    handleZoom(e) {
      if (e.which === 2) return this.restoreScale();
      if (!e.which) {
        ((e.deltaY || -e.wheelDelta || e.detail) >> 10 || 1) < 0
          ? this.zoomIn()
          : this.zoomOut();
      }
    },
    init() {
      this.draw();
      this.enableDrag();
      this.initTransform();
    },
    zoomIn() {
      const originTransformStr = this.$refs.domContainer?.style?.transform;
      if (!originTransformStr) return;
      let targetScale = 1 * 1.2;
      const scaleMatchResult = originTransformStr.match(MATCH_SCALE_REGEX);
      if (scaleMatchResult && scaleMatchResult.length > 0) {
        const originScale = parseFloat(scaleMatchResult[1]);
        targetScale *= originScale;
      }
      this.setScale(targetScale);
    },
    zoomOut() {
      const originTransformStr = this.$refs.domContainer?.style?.transform;
      if (!originTransformStr) return;
      let targetScale = 1 / 1.2;
      const scaleMatchResult = originTransformStr.match(MATCH_SCALE_REGEX);
      if (scaleMatchResult && scaleMatchResult.length > 0) {
        const originScale = parseFloat(scaleMatchResult[1]);
        targetScale = originScale / 1.2;
      }
      this.setScale(targetScale);
    },
    restoreScale() {
      this.setScale(1);
    },
    setScale(scaleNum) {
      if (typeof scaleNum !== "number") return;
      let pos = this.getTranslate();
      if (!pos) return;
      let translateString = `translate(${pos[0]}px, ${pos[1]}px)`;
      if (!this.$refs.domContainer?.style?.transform) return;
      this.$refs.svg.style.transform = `scale(${scaleNum}) ` + translateString;
      this.$refs.domContainer.style.transform =
        `scale(${scaleNum}) ` + translateString;
      this.currentScale = scaleNum;
    },
    getTranslate() {
      let string = this.$refs.svg?.style.transform;
      if (!string) return;
      let match = string.match(MATCH_TRANSLATE_REGEX);
      if (match === null) {
        return [null, null];
      }
      let x = parseInt(match[1]);
      let y = parseInt(match[2]);
      return [x, y];
    },
    addUniqueKey(rootNode) {
      const queue = [rootNode];
      while (queue.length !== 0) {
        const node = queue.pop();
        node._key = uuid();
        if (node.children) {
          queue.push(...node.children);
        }
      }
      return rootNode;
    },
    initTransform() {
      const containerHeight = this.$refs.container.offsetHeight;
      this.initTransformX = 300;
      this.initTransformY = Math.floor(containerHeight / 2);
    },
    generateLinkPath(d) {
      const source = d.source.data;
      const target = d.target.data;

      const sourceRight = source.x + source.width;
      const sourceBottom = source.y + source.height;
      const targetRight = target.x + target.width;
      const targetBottom = target.y + target.height;

      let base = source.isRoot
        ? `M${source.x},${sourceBottom}L${sourceRight},${sourceBottom}`
        : "";

      const steps = [];

      if (source.isRoot) {
        steps.push(
          `M${source.x},${sourceBottom}`,
          `L${sourceRight},${sourceBottom}`
        );
      }

      steps.push(
        `M${sourceRight},${sourceBottom}`,
        `C${sourceRight + 35},${sourceBottom}`,
        `${target.x - 35},${targetBottom}`,
        `${target.x},${targetBottom}`,
        `L${targetRight},${targetBottom}`
      );

      return steps.join(" ");
    },
    draw() {
      this.$nextTick(this.draw_);
    },
    draw_() {
      const [nodeDataList, linkDataList] = this.buildTree(this.tree.root);
      this.linkDataList = linkDataList;
      this.svg = this.d3.select(this.$refs.svg);

      const self = this;
      const links = this.svg.selectAll(".link").data(linkDataList, (d) => {
        return `${d.source.data._key}-${d.target.data._key}`;
      });

      links
        .join("path")
        .attr("class", "link")
        .attr("d", (d) => self.generateLinkPath(d));

      this.nodeDataList = nodeDataList;
    },
    layout(tree) {
      flextree({
        nodeSize: (node) => {
          node.data.measure();
          return [node.data.height, node.data.width + 50];
        },

        spacing: (nodeA, nodeB) => nodeA.path(nodeB).length + 20,
      })(tree);
    },
    buildTree(rootNode) {
      const treeBuilder = this.d3.tree();
      const tree = treeBuilder(this.d3.hierarchy(rootNode));
      this.layout(tree);

      for (const node of tree.descendants()) {
        node.data.x = node.y;
        node.data.y = node.x;
      }

      return [tree.descendants(), tree.links()];
    },
    enableDrag() {
      const svgElement = this.$refs.svg;
      const container = this.$refs.container;
      let startX = 0;
      let startY = 0;
      let isDrag = false;
      let mouseDownTransform = "";
      container.onmousedown = (event) => {
        mouseDownTransform = svgElement.style.transform;
        startX = event.clientX;
        startY = event.clientY;
        isDrag = true;
      };
      container.onmousemove = (event) => {
        if (!isDrag) return;
        const originTransform = mouseDownTransform;
        let originOffsetX = 0;
        let originOffsetY = 0;
        if (originTransform) {
          const result = originTransform.match(MATCH_TRANSLATE_REGEX);
          if (result !== null && result.length !== 0) {
            const [offsetX, offsetY] = result.slice(1);
            originOffsetX = parseInt(offsetX);
            originOffsetY = parseInt(offsetY);
          }
        }
        let newX =
          Math.floor((event.clientX - startX) / this.currentScale) +
          originOffsetX;
        let newY =
          Math.floor((event.clientY - startY) / this.currentScale) +
          originOffsetY;
        let transformStr = `translate(${newX}px, ${newY}px)`;
        if (originTransform) {
          transformStr = originTransform.replace(
            MATCH_TRANSLATE_REGEX,
            transformStr
          );
        }
        svgElement.style.transform = transformStr;
        this.$refs.domContainer.style.transform = transformStr;
      };

      container.onmouseleave = () => {
        startX = 0;
        startY = 0;
        isDrag = false;
      };

      container.onmouseup = () => {
        startX = 0;
        startY = 0;
        isDrag = false;
      };
    },
    formatDimension(dimension) {
      if (typeof dimension === "number") return `${dimension}px`;
      if (dimension.indexOf("px") !== -1) {
        return dimension;
      } else {
        return `${dimension}px`;
      }
    },
    parseDimensionNumber(dimension) {
      if (typeof dimension === "number") {
        return dimension;
      }
      return parseInt(dimension.replace("px", ""));
    },
    nodeContextClick(event, node) {
      event.preventDefault();
      this.setLastNode(node);
      this.$refs.contextMenu?.open(event);
    },
  },
  watch: {
    "tree.root": {
      deep: true,
      immediate: true,
      handler() {
        this.draw();
        this.saveDocument();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
}
.tree-container {
  z-index: 1;
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss">
.node {
  display: flex;
  position: relative;
  flex-direction: column;
  box-sizing: border-box;
  border-radius: 0.6rem;
  padding: 8px;
  height: fit-content;
  color: black;
  user-select: none;

  &.editing {
    padding: 0.5rem;
  }

  .content {
    display: flex;
    position: relative;
    flex-direction: row;
    align-items: flex-end;
    gap: 0.5rem;
  }

  .completeness {
    color: rgba($color: #000000, $alpha: 0.4);
    font-size: 12px;
  }

  .progress-wrapper {
    position: absolute;
    bottom: -20px;
    left: 0;
    border: 1px solid black;
    border-radius: 0.7rem;
    background-color: black;
    width: 100%;
  }

  .progress {
    transition: width 1s ease;
    border-radius: 0.7rem;
    background-color: rgb(44, 189, 44);
    height: 0.2rem;
    overflow: hidden;
    color: white;
    font-size: 0.8rem;
    span {
      margin-left: 0.4rem;
    }
  }
  &.dragover {
    opacity: 1;
    border: 0.2rem solid var(--secondary-clr);
  }
  &.done {
    color: var(--primary-clr);
  }
  &.done pre {
    text-decoration: line-through;
  }
  pre {
    margin: 0;
    padding: 0;
    height: fit-content;
    max-height: 150px;
    font-family: var(--font-family);
    text-align: center;
    text-overflow: ellipsis;
  }

  .drill-up {
    align-self: center;
  }
  textarea {
    width: 100%;
    height: 4rem;
    min-height: 30px;
    max-height: 150px;
    resize: vertical;
    font-size: 1rem;
    font-family: var(--font-family);
  }
  button {
    cursor: pointer;
    box-sizing: border-box;
    outline: none;
    border: 1px solid var(--secondary-clr);
    border-radius: 0.4rem;
    background-color: white;
  }
  button:active {
    border: 1px solid white;
  }
  .add-sibling {
    position: absolute;
    top: 50%;
    left: calc(100% + 1rem);
    transform: translateY(-50%);
  }
  .add-child {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 50%;
    transform: translateX(-50%);
  }
}

.link {
  stroke-width: 1px !important;
  fill: transparent !important;
  stroke: var(--node-link-clr) !important;
}

.tree-container.dragging .link {
  opacity: 0.2;
}
</style>

<style lang="scss" scoped>
.tree-container {
  position: relative;
  overflow: hidden;

  .vue-tree {
    position: relative;
  }

  > svg,
  .dom-container {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0 50%;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .dom-container {
    z-index: 1;
    // pointer-events: none;
  }

  &.dragging .node {
    opacity: 0.7;
  }
}

.node-slot {
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
  box-sizing: content-box;
  background-color: transparent;

  .node-slot-overlay {
    position: relative;

    // top
    &.node-top::before {
      display: inline-block;
      position: absolute;
      bottom: calc(100% + 0.5rem);
      margin-right: 5px;
      border-radius: 1rem;
      background-color: white;
      width: 15px;
      width: 100%;
      height: 15px;
      height: 3rem;
      content: "";
      text-align: center;
    }

    // bottom
    &.node-bottom::before {
      display: inline-block;
      position: absolute;
      top: calc(100% + 0.5rem);
      margin-right: 5px;
      border-radius: 1rem;
      background-color: white;
      width: 15px;
      width: 100%;
      height: 15px;
      height: 3rem;
      content: "";
      text-align: center;
    }

    // right
    &.node-right::before {
      position: absolute;
      left: calc(100% + 0.5rem);
      margin-right: 5px;
      border-radius: 1rem;
      background-color: white;
      width: 15px;
      width: 50%;
      height: 15px;
      height: 3rem;
      content: "";
      text-align: center;
    }
  }
}

.highlighted {
  border: 1px solid gray;
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
  position: absolute;
  border-radius: 1rem;
  background-color: white;
  width: 100%;
  height: 100%;
  content: "";
}

/* Second sheet of stack */
.stack::before {
  top: 4px;
  left: 4px;
  z-index: -1;
}

/* Third sheet of stack */
.stack::after {
  top: 8px;
  left: 8px;
  z-index: -2;
}
</style>
