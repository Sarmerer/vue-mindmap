<template>
  <footer class="statusbar">
    <div class="statusbar__left">
      <span
        class="statusbar__item"
        @click="tree.actions.run('open-trees-modal')">
        <span class="statusbar__item__value">
          <BaseIcon icon="tree-pine" />
          {{ activeTreeLabel }}
        </span>
      </span>

      <span class="statusbar__item">
        <span class="statusbar__item__value">
          <BaseIcon icon="alert-circle" />
          {{ nodes.todo }}

          <BaseIcon icon="check-circle" />
          {{ nodes.completed }}
        </span>
      </span>

      <span class="statusbar__item">
        <span class="statusbar__item__value">
          <BaseIcon icon="circle-dot" />
          {{ activeNodeLabel }}
        </span>
      </span>

      <span class="statusbar__item">
        <span class="statusbar__item__value">
          <BaseIcon icon="clipboard" />
          {{ clipboardContents }}
        </span>
      </span>
    </div>
    <div class="statusbar__right">
      <span class="statusbar__item" @click="tree.actions.run('reset-canvas')">
        <span class="statusbar__item__values">
          <span class="statusbar__item__value">
            <BaseIcon icon="target" />
            {{ canvasPosition }}
          </span>

          <span class="statusbar__item__value">
            <BaseIcon icon="zoom-in" />
            {{ zoomLevel }}
          </span>
        </span>
      </span>
    </div>
  </footer>
</template>

<script>
import { Mindmap } from '../types/mindmap'

export default {
  props: {
    mindmap: Mindmap,
    required: true,
  },

  computed: {
    tree() {
      return this.mindmap.tree
    },

    canvas() {
      return this.mindmap.canvas
    },

    activeTreeLabel() {
      return this.tree.label
    },

    nodes() {
      const root = this.tree.getRoot()
      if (!root) return { todo: 0, completed: 0 }

      const total = root.stats.getChildrenCount(true)
      const completed = root.stats.getCompletedChildrenCount(true)
      const todo = total - completed

      return { todo, completed }
    },

    activeNodeLabel() {
      const activeNode = this.tree.activeNode
      return activeNode ? activeNode.label : 'None'
    },

    clipboardContents() {
      const buffer = this.tree?.clipboard?.buffer
      if (!buffer) return 'Empty'

      const { type, node } = buffer
      const prefix = type === 'cut' ? 'Cut' : 'Copied'
      return `${prefix} ${node.label}`
    },

    canvasPosition() {
      const x = Math.round(this.canvas.x / this.canvas.scale)
      const y = Math.round(this.canvas.y / this.canvas.scale)
      return `x: ${x} y: ${y}`
    },

    zoomLevel() {
      return `${Math.round(this.canvas.scale * 100)}%`
    },
  },
}
</script>

<style scoped>
.statusbar {
  display: flex;
  flex: 0 0 24px;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--color-statusbar-separator);
  background-color: var(--color-statusbar-background);
}

.statusbar__left,
.statusbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
}

.statusbar__item {
  display: flex;
  justify-content: center;
  align-items: center;

  gap: 4px;
  padding: 0 4px;
  height: 100%;
  user-select: none;
}

.statusbar__item:hover {
  cursor: pointer;
  background-color: var(--color-statusbar-hover);
}

.statusbar__item__values {
  display: flex;
  gap: 8px;
}

.statusbar__item__value {
  display: flex;
  align-items: center;
  gap: 4px;

  color: var(--color-statusbar-text);
  font-size: 12px;
}

.statusbar__item__value > .icon {
  width: 12px;
  height: 12px;
}
</style>
