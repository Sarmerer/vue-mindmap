<template>
  <div class="tree-container" ref="container">
    <modal name="info-modal" :adaptive="true" height="auto" width="500px">
      <div id="modal">
        <table class="info-table">
          <tr v-for="(e, index) in events" :key="index" class="info-row">
            <td class="info-col-action">
              {{ e.name }}
            </td>
            <td class="info-col-hotkey">
              {{ e.hotkey.join(" / ") }}
            </td>
          </tr>
        </table>
      </div>
    </modal>
    <button id="modal-button" @click="$modal.show('info-modal')">Help</button>
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
      >
        <div
          class="node"
          :class="{
            highlighted: node.data._gid === dataset.lastNode._gid,
            stack: node.data.childrenLength && node.data.collapsed,
          }"
          @click="setLastNode(node.data)"
        >
          <span v-if="!node.data.editing" class="tree-node"
            >{{ node.data.name }}
          </span>
          <input
            v-else
            v-model="node.data._nameEdit"
            :ref="`node-#${node.data._gid}`"
            @blur="blurLastNode"
            @keydown.esc="cancelNodeEdit"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { tree } from "@/tree";
import { events, eventBus } from "@/hotkeys";

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
  name: "vue-tree",
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          nodeWidth: DEFAULT_NODE_WIDTH,
          nodeHeight: DEFAULT_NODE_HEIGHT,
          levelHeight: DEFAULT_LEVEL_HEIGHT,
        };
      },
    },
    linkStyle: {
      type: String,
      default: LinkStyle.CURVE,
    },
  },
  data() {
    return {
      d3,
      events,
      dataset: tree,
      colors: "568FE1",
      nodeDataList: [],
      linkDataList: [],
      initTransformX: 0,
      initTransformY: 0,
      currentScale: 1,
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
    this.addUniqueKey(this.dataset);
    window.addEventListener("wheel", this.handleZoom);
    window.addEventListener("auxclick", this.handleZoom);

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
  mounted() {
    this.init();
  },

  beforeDestroyed() {
    window.removeEventListener("wheel", this.handleZoom);
    window.removeEventListener("auxclick", this.handleZoom);
  },
  methods: {
    addSibling() {
      tree.addSibling();
      this.focusInput(`node-#${tree.lastNode._gid}`);
    },
    addChild() {
      tree.addChild();
      this.focusInput(`node-#${tree.lastNode._gid}`);
    },
    setLastNodeName() {
      tree.setLastNodeName();
    },
    setLastNode(node) {
      if (tree.lastNode._gid === node._gid) return this.collapseLastNode();
      tree.lastNode = node;
    },
    editLastNode(e) {
      if (!tree.lastNode.editing) e?.preventDefault();
      tree.editLastNode();
      this.focusInput(`node-#${tree.lastNode._gid}`);
    },
    blurLastNode() {
      tree.blurLastNode();
    },
    collapseLastNode() {
      tree.collapseLastNode();
    },
    deleteLastNode() {
      tree.deleteLastNode();
    },
    cancelNodeEdit() {
      tree.lastNode.firstEdit
        ? tree.deleteLastNode({ force: true })
        : (tree.lastNode.editing = false);
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

    handleZoom(e) {
      if (e.which === 2) return this.restoreScale();
      if (!e.which)
        ((e.deltaY || -e.wheelDelta || e.detail) >> 10 || 1) < 0
          ? this.zoomIn()
          : this.zoomOut();
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
          .x(function(d) {
            return d.x;
          })
          .y(function(d) {
            return d.y;
          })
          .source(function(d) {
            const sourcePoint = {
              x: d.source.x,
              y: d.source.y,
            };
            return rotatePoint(sourcePoint);
          })
          .target(function(d) {
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
      const [nodeDataList, linkDataList] = this.buildTree(this.dataset);
      this.linkDataList = linkDataList;
      this.svg = this.d3.select(this.$refs.svg);

      const self = this;
      const links = this.svg.selectAll(".link").data(linkDataList, (d) => {
        return `${d.source.data._key}-${d.target.data._key}`;
      });

      links
        .enter()
        .append("path")
        .style("opacity", 0)
        .transition()
        .duration(ANIMATION_DURATION)
        .ease(d3.easeCubicInOut)
        .style("opacity", 1)
        .attr("class", "link")
        .attr("d", function(d) {
          return self.generateLinkPath(d);
        });
      links
        .transition()
        .duration(ANIMATION_DURATION)
        .ease(d3.easeCubicInOut)
        .attr("d", function(d) {
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

      container.onmouseup = () => {
        startX = 0;
        startY = 0;
        isDrag = false;
      };
    },
    onClickNode(index) {
      const curNode = this.nodeDataList[index];
      if (curNode.data.children) {
        curNode.data._children = curNode.data.children;
        curNode.data.children = null;
        curNode.data._collapsed = true;
      } else {
        curNode.data.children = curNode.data._children;
        curNode.data._children = null;
        curNode.data._collapsed = false;
      }
      this.draw();
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
  },
  watch: {
    dataset: {
      deep: true,
      immediate: true,
      handler() {
        this.draw();
      },
    },
  },
};
</script>

<style lang="scss">
#modal-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.4rem;
  border: none;
  z-index: 1;
}

#modal-button:active {
  top: 1.07rem;
  border: none;
}

#modal {
  padding: 1rem;
  user-select: none;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
}

.info-row:nth-child(odd) {
  background-color: rgba(167, 167, 167, 0.408);
}

.info-row > td {
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  border: 1px solid black;
}

.info-col-action {
  width: 50%;
  padding-right: 1rem;
  text-align: right;
}

.info-col-hotkey {
  width: 50%;
  padding-left: 1rem;
  text-align: left;
}

.tree-container {
  width: 100%;
  height: 100%;
  .node {
    padding: 1rem;
    border-radius: 0.2rem;
    background-color: grey;
    color: white;
    user-select: none;
  }

  .link {
    stroke-width: 2px !important;
    fill: transparent !important;
    stroke: #cecece !important;
  }
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
  transition: all 0.1s;
  transition-timing-function: ease-in-out;
}

.highlighted {
  border: 2px solid black;
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
