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
      <template v-if="!note.isEditing">
        <pre class="note__label" v-text="note.label"></pre>
        <span class="note__icon-wrapper" @click="toggleEmojiBar">
          <span v-if="note.icon" class="note__icon" v-text="note.icon"></span>
        </span>
      </template>

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

  methods: {
    toggleEmojiBar() {
      this.note.notebook.actions.run('toggle-emoji-bar')
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

  transition: background-color 0.1s ease-in-out;
  cursor: pointer;
  border: 1px solid var(--color-notebook-note-border);
  border-radius: 4px;
  background-color: var(--color-notebook-note-background);
  width: 90px;
  height: 130px;
}

.note:hover {
  background-color: var(--color-notebook-note-background-active);
}

.note:hover .note__icon-wrapper:empty {
  background-color: var(--color-notebook-note-background);
}

.note.active {
  z-index: var(--layer-modal);
  border-color: var(--color-notebook-note-border-active);
  background-color: var(--color-notebook-note-background-active);
}

.note.shadow {
  border: 1px dashed var(--color-notebook-shadow-border);
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
  justify-content: space-between;

  cursor: grab;
  padding: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note__label {
  word-wrap: break-word;
  display: inline;

  cursor: text;
  margin: 0;
  border: none;
  background-color: transparent;
  padding: 0;
  color: var(--color-notebook-note-text);
  font-size: 14px;
  font-family: inherit;
  user-select: none;
  white-space: pre-wrap;
}

.note__icon-wrapper {
  align-self: flex-end;

  cursor: pointer;
  border-radius: 50%;
  width: 24px;
  height: 24px;
}

.note__icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -2px;
  width: 100%;
  height: 100%;
  font-size: 14px;
}

.note__editor {
  display: flex;
  position: relative;
  flex: 1 1 auto;
  flex-direction: column;
}

.note__editor__input {
  outline: none;
  background-color: var(--color-notebook-note-background);
  height: 100%;
  resize: none;
  color: var(--color-notebook-note-text);
  font-size: 14px;
  line-height: 1.5;
}
</style>
