<template>
  <div
    :id="group.id"
    class="group"
    :class="{ active: group.isActive, shadow: group.isShadow }"
    :style="{ transform: `translate(${group.x}px, ${group.y}px)` }"
    @mousedown.stop.prevent="group.notebook.reorder.maybeStart(group)">
    <Note
      v-for="note in group.notes"
      :key="note.id"
      :note="note"
      class="group__note" />
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
  gap: 8px;
  z-index: var(--layer-overlay);

  transition: border-color 0.1s ease-in-out, background-color 0.1s ease-in-out;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 12px;
  width: fit-content;
}

.group:hover {
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

.group__note {
  position: relative;
}
</style>
