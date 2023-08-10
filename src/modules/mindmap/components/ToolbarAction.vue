<template>
  <BaseButton
    v-bind="{ title }"
    class="action-button"
    @click.stop="action.run()">
    <BaseIcon :icon="action.icon" :intent="action.intent" />
  </BaseButton>
</template>

<script>
import { Action } from '../types/action'

export default {
  props: {
    action: {
      type: Action,
      required: true,
    },
  },

  computed: {
    title() {
      if (!this.action.hotkeys.length) return this.action.label

      return `${this.action.label} (${this.action.hotkeys[0]})`
    },
  },
}
</script>

<style scoped>
.action-button {
  display: flex;
  justify-content: center;
  align-items: center;

  transition: background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: none;
  border: 2px solid var(--color-toolbar-border);
  border-radius: 4px;
  background-color: var(--color-toolbar-foreground);
  padding: 0;
  width: 32px;
  height: 32px;

  color: var(--color-toolbar-text);
  font-size: 14px;
}

.action-button:hover {
  background-color: var(--color-toolbar-foreground-active);
  color: var(--color-toolbar-text-active);
}

.action-button:focus,
.action-button:active {
  outline: none;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
  background-color: var(--color-toolbar-foreground-active);
  color: var(--color-toolbar-text-active);
}
</style>
