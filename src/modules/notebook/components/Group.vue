<template>
  <div
    :id="group.id"
    class="group"
    :class="{
      active: group.isActive,
      shadow: group.isShadow,
      'align--left': group.align.left,
      'align--right': group.align.right,
      'align--up': group.align.top,
      'align--bottom': group.align.bottom,
    }"
    :style="{ transform: `translate(${group.x}px, ${group.y}px)` }"
    @mousedown.stop.prevent="group.notebook.reorder.maybeStart(group)">
    <div class="group__handle">
      <BaseIcon icon="grip" :size="14" />
    </div>

    <div class="group__notes">
      <Note
        v-for="note in group.notes"
        :key="note.id"
        :note="note"
        class="group__note" />
    </div>
  </div>
</template>

<script>
import { Group } from '../types/group'

import Note from './Note.vue'

export default {
  props: {
    group: {
      type: Group,
      required: true,
    },
  },

  components: { Note },
}
</script>

<style scoped>
.group {
  display: flex;
  position: absolute;
  flex-direction: column;
  gap: 8px;
  z-index: var(--layer-overlay);

  transition: border-color 0.1s ease-in-out, background-color 0.1s ease-in-out;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: fit-content;
}

.group:hover:not(:has(*:hover)) {
  cursor: move;
  border-color: #999;
  background-color: rgba(255, 255, 255, 0.15);
}

.group.active {
  border-color: #999;
  background-color: rgba(255, 255, 255, 0.15);
}

.group.shadow {
  border: 1px dashed #ccc;
  background-color: rgba(255, 255, 255, 0.15);
}

.group.align--up {
  border-top: 1px solid var(--color-info-background);
}

.group.align--right {
  border-right: 1px solid var(--color-info-background);
}

.group.align--bottom {
  border-bottom: 1px solid var(--color-info-background);
}

.group.align--left {
  border-left: 1px solid var(--color-info-background);
}

.group__handle {
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: move;
  width: 24px;
  height: 24px;

  color: #999;
}

.group__notes {
  display: flex;
  gap: 8px;
  padding: 12px;
  padding-top: 0;
}

.group__note {
  position: relative;
}
</style>
