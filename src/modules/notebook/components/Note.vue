<template>
  <div
    :id="note.id"
    class="note"
    :class="{
      editing: note.isEditing,
      active: note.isActive,
      shadow: note.isShadow,
    }"
    :style="{ translate }"
    @dblclick.stop.prevent="note.isEditing = true"
    @mousedown.stop.prevent="note.notebook.reorder.maybeStart(note)">
    <div class="note__content">
      <pre v-if="!note.isEditing" class="note__label" v-text="note.label"></pre>

      <div v-else class="note__editor">
        <BaseTextarea
          class="note__editor__input"
          autofocus
          :value="note.label"
          placeholder="Name your note..."
          @focusout="note.isEditing = false"
          @enter="
            ;(note.label = $event.target.value), (note.isEditing = false)
          " />
      </div>
    </div>
  </div>
</template>

<script>
import { Note } from '../types/note'

export default {
  props: {
    note: {
      type: Note,
      required: true,
    },
  },

  computed: {
    translate() {
      if (this.note.group) return '0px 0px'

      return `${this.note.x}px ${this.note.y}px`
    },
  },
}
</script>

<style scoped>
.note {
  display: flex;
  position: absolute;
  flex-direction: column;
  z-index: var(--layer-overlay);

  transition: box-shadow 0.1s ease-in-out, background-color 0.1s ease-in-out;
  cursor: pointer;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  background-color: var(--color-main-foreground);
  width: 90px;
  height: 130px;
}

.note.active {
  z-index: var(--layer-modal);

  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  background-color: var(--color-main-foreground-active);
}

.note.shadow {
  border: 1px dashed var(--color-main-foreground);
  background-color: transparent;
}

.note.shadow .note__content {
  display: none;
}

.note.editing .note__content {
  padding: 4px;
}

.note__content {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: 8px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note__label {
  word-wrap: break-word;
  display: inline;
  margin: 0;
  border: none;
  background-color: transparent;
  padding: 0;

  font-size: 14px;
  font-family: inherit;
  user-select: none;
  white-space: pre-wrap;
}

.note__editor {
  display: flex;
  position: relative;
  flex: 1 1 auto;
  flex-direction: column;
}

.note__editor__input {
  outline: none;
  border: none;
  border-radius: 4px;
  background-color: var(--color-main-background);
  height: 100%;
  resize: none;
  color: var(--color-main-text);
  font-size: 14px;
  line-height: 1.5;
}
</style>
