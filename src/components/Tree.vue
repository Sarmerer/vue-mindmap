<template>
  <div class="wrapper">
    <context-menu ref="contextMenu">
      <template #items>
        <button class="context-menu-item" @click="addSibling">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-node-plus"
            viewBox="0 -3 16 16"
            id="addSibling"
          >
            <path
              fill-rule="evenodd"
              d="M11 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM6.025 7.5a5 5 0 1 1 0 1H4A1.5 1.5 0 0 1 2.5 10h-1A1.5 1.5 0 0 1 0 8.5v-1A1.5 1.5 0 0 1 1.5 6h1A1.5 1.5 0 0 1 4 7.5h2.025zM11 5a.5.5 0 0 1 .5.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2A.5.5 0 0 1 11 5zM1.5 7a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1z"
            />
          </svg>
          Add sibling
        </button>
        <button class="context-menu-item" @click="addChild">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-diagram-2"
            viewBox="0 -2 16 16"
            id="addChild"
          >
            <path
              fill-rule="evenodd"
              d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H11a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 5 7h2.5V6A1.5 1.5 0 0 1 6 4.5v-1zM8.5 5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1zM3 11.5A1.5 1.5 0 0 1 4.5 10h1A1.5 1.5 0 0 1 7 11.5v1A1.5 1.5 0 0 1 5.5 14h-1A1.5 1.5 0 0 1 3 12.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zm4.5.5a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1A1.5 1.5 0 0 1 9 12.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1z"
            /></svg
          >Add child
        </button>
        <button
          class="context-menu-item"
          @click="toggleDone"
          v-if="!tree.lastNode.done"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-check2"
            viewBox="0 -2 16 16"
          >
            <path
              d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
            />
          </svg>
          Done
        </button>
        <button class="context-menu-item" @click="toggleDone" v-else>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-x"
            viewBox="0 -2 16 16"
          >
            <path
              d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
          Undo
        </button>
        <button
          class="context-menu-item"
          @click="pushRootToQuery"
          v-if="tree.lastNode.getChildren().length"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-bar-down"
            viewBox="0 -2 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zM8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6z"
            />
          </svg>
          Drill down
        </button>
        <button
          v-if="tree.lastNode.collapsed"
          class="context-menu-item"
          @click="collapseLastNode"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            fill="currentColor"
            class="bi bi-arrows-expand"
            viewBox="0 -1 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zM7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10z"
            />
          </svg>
          Expand
        </button>
        <button v-else class="context-menu-item" @click="collapseLastNode">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            fill="currentColor"
            class="bi bi-arrows-collapse"
            viewBox="0 -1 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zm7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0zm-.5 11.707-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0v-3.793z"
            />
          </svg>
          Collapse
        </button>
        <button class="context-menu-item" @click="editLastNode">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="currentColor"
            class="bi bi-pencil"
            viewBox="1 -1 16 16"
          >
            <path
              d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"
            /></svg
          >Edit
        </button>
        <button class="context-menu-selector">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-gear"
            viewBox="0 -2 18 18"
          >
            <path
              d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"
            />
            <path
              d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"
            />
          </svg>
          Settings
          <ul>
            <li
              v-for="(value, key) in tree.lastNode.settings"
              :key="key"
              @click="tree.lastNode.toggleSetting(key)"
            >
              {{ key }}
              <svg
                v-if="value"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-check2"
                viewBox="0 -2 16 16"
              >
                <path
                  d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
                />
              </svg>
            </li>
          </ul>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="arrow"
            viewBox="0 -1 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </button>
        <button class="context-menu-item" @click="deleteLastNode">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-node-minus"
            viewBox="0 -3 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M11 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM6.025 7.5a5 5 0 1 1 0 1H4A1.5 1.5 0 0 1 2.5 10h-1A1.5 1.5 0 0 1 0 8.5v-1A1.5 1.5 0 0 1 1.5 6h1A1.5 1.5 0 0 1 4 7.5h2.025zM1.5 7a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM8 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5A.5.5 0 0 1 8 8z"
            />
          </svg>
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
              @mousedown.stop
              @click="setLastNode(node.data, $event)"
              @contextmenu="nodeContextClick($event, node.data)"
              draggable
              @dragstart="startDrag($event, node)"
              @drag="onDrag($event, node)"
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
                <pre v-if="!node.data.editing" v-text="node.data.name"></pre>
                <button
                  v-if="
                    tree._query.length &&
                    !node.data._parentNode &&
                    !node.ediiting
                  "
                  @click="spliceRootsQuery"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-arrow-bar-up"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5zm-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z"
                    />
                  </svg>
                </button>
              </div>
              <textarea
                v-if="node.data.editing"
                v-model="node.data._name"
                :ref="`node-#${node.data._gid}`"
                @blur="blurLastNode(node.data)"
                @keydown.esc="cancelNodeEdit"
              ></textarea>
              <!-- <button v-if="node.data.editing">Save</button> -->
              <div class="controls">
                <button class="add-child" @click.stop="addSibling()">
                  <svg width="16" height="16" viewBox="0 2 16 16">
                    <use href="#addSibling" />
                  </svg>
                </button>
                <button class="add-sibling" @click="addChild()">
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <use href="#addChild" />
                  </svg>
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
  </div>
</template>
<script>
import Toolbar from "@/components/Toolbar";
import ContextMenu from "@/components/ContextMenu";

import * as d3 from "d3";
import { tree } from "@/tree";
import { events, eventBus } from "@/hotkeys";
import { store } from "@/store2.0";
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
          levelHeight: DEFAULT_LEVEL_HEIGHT,
        };
      },
    },
    linkStyle: {
      type: String,
      default: LinkStyle.CURVE,
    },
  },
  components: { Toolbar, ContextMenu },
  data() {
    return {
      d3,
      events,
      store,
      tree,
      dataset: tree,
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
    this.addUniqueKey(this.dataset);
    window.addEventListener("unload", this.beforeUnload);

    eventBus.$on("tree-push-root", this.pushRootToQuery);
    eventBus.$on("tree-pop-root", this.spliceRootsQuery);
    eventBus.$on("tree-add-sibling", this.addSibling);
    eventBus.$on("tree-add-child", this.addChild);
    eventBus.$on("tree-set-last-node", (args) => {
      if (args && args[0]) this.setLastNode(args[0]);
    });
    eventBus.$on("tree-node-toggle-emoji", this.toggleEmoji);
    eventBus.$on("tree-node-collapse", this.collapseLastNode);
    eventBus.$on("tree-node-edit", (e) => this.editLastNode(e));

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
      if (!this.nodeDrag.target || this.nodeDrag.target === node) {
        this.nodeDrag.dragging = false;
        return;
      }
      tree.cloneNode(node.data, this.nodeDrag.target.data, this.nodeDrag.snap);
      node.collapsed = false;
      this.nodeDrag.dragging = false;
      this.nodeDrag.target = null;
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
      this.saveDocument();
    },
    addChild() {
      tree.addChild();
      this.focusInput(`node-#${tree.lastNode._gid}`);
      this.saveDocument();
    },
    toggleDone() {
      tree.lastNode.toggleDoneState();
    },
    shouldDisplayProgress(node) {
      return node?.settings?.displayProgress;
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
    editLastNode(e) {
      if (!tree.lastNode.editing) e?.preventDefault();
      tree.editLastNode();
      this.focusInput(`node-#${tree.lastNode._gid}`);
      this.saveDocument();
    },
    blurLastNode(triggerNode) {
      tree.blurLastNode(triggerNode);
    },
    collapseLastNode() {
      tree.collapseLastNode();
    },
    deleteLastNode() {
      tree.deleteLastNode();
      this.saveDocument();
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
    saveDocument() {
      this.saveDocumentAction(tree.exportToStore());
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
      gap: 0.5rem;
      margin: 1rem;
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
      margin: 0;
      padding: 0;
      text-align: center;
      height: fit-content;
      font-family: var(--font-family);
    }
    textarea {
      margin: 0.5rem;
      height: 4rem;
      font-size: 1rem;
      font-family: var(--font-family);
      resize: none;
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
      top: calc(-100% - 0.5rem);
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
      right: calc(-50% - 0.5rem);
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
