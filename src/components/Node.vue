<template>
  <node
    v-for="node of nodeDataList"
    :key="node.data._key"
    :node="node"
    @node-drag-over="(args) => mouseOverNode(...args)"
    @node-drag-stop="(args) => onDrop(...args)"
    @node-drag-start="(args) => startDrag(...args)"
    @node-drag="(args) => onDrag(...args)"
    @node-set-last="(args) => setLastNode(...args)"
    @node-quit-editor="quitNodeEditor"
    @node-context-click="(args) => nodeContextClick(...args)"
    @node-add-child="(args) => addChild(...args)"
    @node-add-sibling="(args) => addSibling(...args)"
    @node-blur="blurLastNode"
    @splice-roor="spliceRootsQuery"
  ></node>
  <div
    class="node-slot"
    :style="{
      left: `${node.y}px`,
      top: `${node.x}px`,
    }"
    @dragover.stop="emit('node-drag-over', $event, node)"
    @dragend="emit('node-drag-stop', $event, node)"
  >
    <div class="node-slot-overlay">
      <!-- :class="{
        'node-top': nodeDrag.snap === 'top' && isDraggedOver(node.data),
        'node-bottom': nodeDrag.snap === 'bottom' && isDraggedOver(node.data),
        'node-right': nodeDrag.snap === 'right' && isDraggedOver(node.data),
      }" -->
      <!-- dragover: isDraggedOver(node.data), -->
      <div
        class="node"
        :class="{
          highlighted: node.data._gid === tree.lastNode._gid,
          stack: node.data.childrenLength && node.data.collapsed,
          done: node.data.done,
        }"
        @mousedown.stop
        @click="emit('node-set-last', nodeData, $event)"
        @contextmenu="emit('node-context-click', $event, nodeData)"
        :draggable="node.data.draggable"
        @dragstart="emit('node-drag-start', $event, node)"
        @drag="emit('node-drag')"
      >
        <div class="content" v-if="!node.data.editing">
          <div v-if="!node.data.editing && hasEmoji">
            <span
              v-for="(emoji, key) in emojifiedArray"
              :key="key"
              v-text="emoji"
            >
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
            @click.stop="emit('splice-root')"
          >
            <b-icon icon="arrow-bar-up"></b-icon>
          </button>
        </div>
        <textarea
          v-if="node.data.editing"
          v-model="node.data._name"
          :ref="`node-#${node.data._gid}`"
          @keydown.esc="emit('node-quit-editor')"
          @keydown.enter.prevent="
            emit('node-quit-editor', $event, { save: true })
          "
          @keydown.tab.prevent="emit('node-add-child', $event)"
          @keydown.exact.stop
          @blur="emit('node-blur', nodeData)"
          @mousewheel.stop
        ></textarea>
        <!-- <button v-if="node.data.editing">Save</button> -->
        <div class="controls">
          <button class="add-child" @click.stop="emit('node-add-sibling')">
            <b-icon icon="node-plus"></b-icon>
          </button>
          <button class="add-sibling" @click="emit('node-add-child')">
            <b-icon icon="diagram2"></b-icon>
          </button>
        </div>
        <sub class="completeness">10/15</sub>
        <div
          v-if="shouldDisplayProgress"
          class="progress"
          :class="{ 'round-right': node.data.progress == 100 }"
          :style="{ width: `${node.data.progress}%` }"
          :title="`${node.data.progress}%`"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import { tree } from "@/tree";
import emojis from "node-emoji";

export default {
  props: {
    node: { type: Object, required: true },
  },
  computed: {
    nodeData() {
      return this.node?.data;
    },
    shouldDisplayProgress() {
      return this.nodeData?.settings?.displayProgress;
    },
    emojifiedArray() {
      const array = this.nodeData?.emoji;
      if (!array?.length) return "";
      return array.map((a) => emojis.get(a));
    },

    hasEmoji() {
      return this.nodeData?.emoji?.length > 0;
    },
  },
  data() {
    return {
      tree,
    };
  },
  methods: {
    emit(eventName, ...args) {
      this.$emit(eventName, args);
    },
  },
};
</script>
<style lang="scss" scoped>
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

  .completeness {
  }

  .progress {
    position: absolute;
    overflow: hidden;
    bottom: 0;
    height: 0.4rem;
    background-color: rgb(44, 189, 44);
    border-bottom-left-radius: 0.7rem;
    font-size: 0.8rem;
    color: white;
    transition: width 1s ease;
    span {
      margin-left: 0.4rem;
    }

    &.round-right {
      border-bottom-right-radius: 0.7rem;
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
