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
          v-if="tree.lastNode._children.length && !tree.lastNode.isRoot"
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
            width: formatDimension(config.nodeWidth),
            height: formatDimension(config.nodeHeight),
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
              class="node"
              :class="{
                dragover: isDraggedOver(node.data),

                highlighted: node.data._gid === tree.lastNode._gid,
                stack: node.data.childrenLength && node.data.collapsed,
                done: node.data.done,
              }"
              :style="{
                'max-width': formatDimension(config.nodeMaxWidth),
                'max-height': formatDimension(config.nodeMaxHeight),
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
                <button
                  class="drill-up"
                  v-if="node.data.isRoot && tree.hasQuery"
                  @click.stop="spliceRootsQuery"
                >
                  <b-icon icon="arrow-bar-up"></b-icon>
                </button>
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
              <!-- <button v-if="node.data.editing">Save</button> -->
              <div class="controls">
                <button class="add-child" @click.stop="addSibling">
                  <b-icon icon="node-plus"></b-icon>
                </button>
                <button class="add-sibling" @click="addChild">
                  <b-icon icon="diagram2"></b-icon>
                </button>
              </div>
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
        </div>
      </div>
    </div>
    <breadcrumb></breadcrumb>
  </div>
</template>
<script>
import Toolbar from "@/components/Toolbar";
import Breadcrumb from "@/components/Breadcrumb";
import ContextMenu from "@/components/ContextMenu";

import * as d3 from "d3";
import { flextree } from "d3-flextree";
const layout = flextree();

import { tree } from "@/tree";
import { events, eventBus } from "@/hotkeys";
import { store } from "@/store";
import { mapActions } from "vuex";
import emojis from "node-emoji";

const MATCH_TRANSLATE_REGEX = /translate\((-?\d+)px, ?(-?\d+)px\)/i;
const MATCH_SCALE_REGEX = /scale\((\S*)\)/i;

const LinkStyle = {
  CURVE: "curve",
  STRAIGHT: "straight",
};

const DEFAULT_NODE_WIDTH = 200;
const DEFAULT_NODE_HEIGHT = 100;
const DEFAULT_LEVEL_HEIGHT = 200;

const ANIMATION_DURATION = 0;

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

function rotatePoint({ x, y }) {
  return {
    x: y,
    y: x,
  };
}

export default {
  name: "Tree",
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          nodeWidth: DEFAULT_NODE_WIDTH,
          nodeHeight: DEFAULT_NODE_HEIGHT,
          nodeMaxWidth: 150,
          nodeMaxHeight: 200,
          levelHeight: DEFAULT_LEVEL_HEIGHT,
        };
      },
    },
    linkStyle: {
      type: String,
      default: LinkStyle.CURVE,
    },
  },
  components: { Toolbar, ContextMenu, Breadcrumb },
  data() {
    return {
      d3,
      events,
      store,
      tree,
      colors: "568FE1",
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
    window.addEventListener("unload", this.beforeUnload);

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
    beforeUnload() {
      this.saveDocument();
      window.removeEventListener("unload", this.beforeUnload);
    },
    spliceRootsQuery(n = 1) {
      tree.spliceRootsQuery(n);
    },
    pushRootToQuery() {
      if (tree.lastNode && tree.lastNode.getChildren().length)
        tree.pushRootToQuery(tree.lastNode);
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
    collapseLastNode() {
      tree.collapseLastNode();
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
        tree.lastNode.trimName();
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
      this.initTransformX = Math.floor(this.config.nodeWidth);
      this.initTransformY = Math.floor(containerHeight / 2);
    },
    generateLinkPath(d) {
      if (this.linkStyle === LinkStyle.CURVE) {
        const linkPath = d3.linkHorizontal();
        linkPath
          .x(function (d) {
            return d.x;
          })
          .y(function (d) {
            return d.y;
          })
          .source(function (d) {
            const sourcePoint = {
              x: d.source.x,
              y: d.source.y,
            };
            return rotatePoint(sourcePoint);
          })
          .target(function (d) {
            const targetPoint = {
              x: d.target.x,
              y: d.target.y,
            };
            return rotatePoint(targetPoint);
          });
        return linkPath(d);
      }
      if (this.linkStyle === LinkStyle.STRAIGHT) {
        // the link path is: source -> secondPoint -> thirdPoint -> target
        const linkPath = d3.path();
        let sourcePoint = { x: d.source.x, y: d.source.y };
        let targetPoint = { x: d.target.x, y: d.target.y };
        sourcePoint = rotatePoint(sourcePoint);
        targetPoint = rotatePoint(targetPoint);
        const xOffset = targetPoint.x - sourcePoint.x;
        const secondPoint = {
          x: sourcePoint.x + xOffset / 2,
          y: sourcePoint.y,
        };
        const thirdPoint = { x: sourcePoint.x + xOffset / 2, y: targetPoint.y };
        linkPath.moveTo(sourcePoint.x, sourcePoint.y);
        linkPath.lineTo(secondPoint.x, secondPoint.y);
        linkPath.lineTo(thirdPoint.x, thirdPoint.y);
        linkPath.lineTo(targetPoint.x, targetPoint.y);
        return linkPath.toString();
      }
    },
    draw() {
      const [nodeDataList, linkDataList] = this.buildTree(this.tree.root);
      this.linkDataList = linkDataList;
      this.svg = this.d3.select(this.$refs.svg);

      const self = this;
      const links = this.svg.selectAll(".link").data(linkDataList, (d) => {
        return `${d.source.data._key}-${d.target.data._key}`;
      });

      links
        .enter()
        .append("path")
        // .style("opacity", 0)
        // .transition()
        // .duration(ANIMATION_DURATION)
        // .ease(d3.easeCubicInOut)
        // .style("opacity", 1)
        .attr("class", "link")
        .attr("d", function (d) {
          return self.generateLinkPath(d);
        });
      links
        .transition()
        .duration(ANIMATION_DURATION)
        .ease(d3.easeCubicInOut)
        .attr("d", function (d) {
          return self.generateLinkPath(d);
        });
      links
        .exit()
        .transition()
        .duration(ANIMATION_DURATION / 2)
        .ease(d3.easeCubicInOut)
        .style("opacity", 0)
        .remove();

      this.nodeDataList = nodeDataList;
    },
    buildTree(rootNode) {
      const treeBuilder = this.d3
        .tree()
        .nodeSize([this.config.nodeWidth, this.config.levelHeight]);
      const tree = treeBuilder(this.d3.hierarchy(rootNode));
      layout(tree);
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
</style>
<style lang="scss">
.tree-container {
  width: 100%;
  height: 100%;
  .node {
    border-radius: 0.6rem;
    box-sizing: border-box;
    border: 1px solid grey;
    background-color: var(--node-bg-clr);
    color: black;
    user-select: none;
    height: fit-content;
    position: relative;

    .content {
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
      margin: 1rem;
      position: relative;
    }

    .progress {
      position: absolute;
      overflow: hidden;
      bottom: 0;
      height: 0.4rem;
      background-color: rgb(44, 189, 44);
      border-bottom-left-radius: 0.5rem;
      font-size: 0.8rem;
      color: white;
      transition: width 1s ease;
      span {
        margin-left: 0.4rem;
      }

      &.round-right {
        border-bottom-right-radius: 0.5rem;
      }
    }
    &.dragover {
      border: 0.2rem solid var(--secondary-clr);
      opacity: 1;
    }
    &.done {
      background-color: var(--primary-clr);
    }
    &.done pre {
      text-decoration: line-through;
    }
    pre {
      overflow: hidden;
      text-overflow: ellipsis;
      max-height: 150px;
      margin: 0;
      padding: 0;
      text-align: center;
      height: fit-content;
      font-family: var(--font-family);
      white-space: pre-line;
      word-wrap: break-word;
      overflow: auto;
    }
    .drill-up {
      align-self: center;
    }
    textarea {
      margin: 0.5rem;
      height: 4rem;
      width: calc(100% - 1.5rem);
      font-size: 1rem;
      font-family: var(--font-family);
      resize: vertical;
      max-height: 150px;
    }
    &:not(.highlighted) .controls {
      display: none;
    }
    button {
      cursor: pointer;
      outline: none;
      border: 1px solid var(--secondary-clr);
      border-radius: 0.4rem;
      box-sizing: border-box;
      background-color: white;
    }
    button:active {
      border: 1px solid white;
    }
    .add-sibling {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: calc(100% + 1rem);
    }
    .add-child {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: calc(100% + 0.5rem);
    }
  }

  .link {
    stroke-width: 2px !important;
    fill: transparent !important;
    stroke: var(--node-link-clr) !important;
  }
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
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    overflow: visible;
    transform-origin: 0 50%;
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
  cursor: pointer;
  position: absolute;
  background-color: transparent;
  box-sizing: border-box;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: content-box;

  .node-slot-overlay {
    position: relative;

    // top
    &.node-top::before {
      content: "";
      display: inline-block;
      width: 15px;
      height: 15px;
      margin-right: 5px;
      position: absolute;
      bottom: calc(100% + 0.5rem);
      width: 100%;
      height: 3rem;
      text-align: center;
      background-color: white;
      border-radius: 1rem;
    }

    // bottom
    &.node-bottom::before {
      content: "";
      display: inline-block;
      width: 15px;
      height: 15px;
      margin-right: 5px;
      position: absolute;
      top: calc(100% + 0.5rem);
      width: 100%;
      height: 3rem;
      text-align: center;
      background-color: white;
      border-radius: 1rem;
    }

    // right
    &.node-right::before {
      content: "";
      width: 15px;
      height: 15px;
      margin-right: 5px;
      position: absolute;
      left: calc(100% + 0.5rem);
      width: 50%;
      height: 3rem;
      text-align: center;
      background-color: white;
      border-radius: 1rem;
    }
  }
}

.highlighted {
  border: 2px solid var(--secondary-clr);
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
  background-color: white;
  border-radius: 1rem;
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
