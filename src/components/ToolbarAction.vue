<template>
  <BaseButton
    v-bind="{ title }"
    class="action-button"
    @click.stop="action.run()"
  >
    <b-icon :icon="action.icon"></b-icon>
  </BaseButton>
</template>

<script>
import { Action } from "../types/action";
import BaseButton from "./base/Button";

export default {
  props: {
    action: {
      type: Action,
      required: true,
    },
  },

  components: { BaseButton },

  computed: {
    title() {
      if (!this.action.hotkeys.length) return this.action.label;

      return `${this.action.label} (${this.action.hotkeys[0]})`;
    },
  },
};
</script>

<style scoped>
.action-button {
  display: flex;
  justify-content: center;
  align-items: center;

  transition: background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: none;
  border: 2px solid #a03bc3;
  border-radius: 4px;
  padding: 0;
  width: 32px;
  height: 32px;
  font-size: 14px;
}

.action-button:hover {
  background-color: #a03bc3;
}

.action-button:focus,
.action-button:active {
  outline: none;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
  background-color: #a03bc3;
}
</style>
