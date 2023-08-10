<template>
  <button
    :class="['base-button', `base-button--${intent}`]"
    v-bind="$attrs"
    v-on="$listeners">
    <slot name="icon-left">
      <BaseIcon v-if="iconLeft" :icon="iconLeft" />
    </slot>

    <slot />

    <slot name="icon-right">
      <BaseIcon v-if="iconRight" :icon="iconRight" />
    </slot>
  </button>
</template>

<script>
export default {
  props: {
    iconLeft: {
      type: String,
      default: '',
    },

    iconRight: {
      type: String,
      default: '',
    },

    intent: {
      type: String,
      default: 'primary',
      validator: (value) =>
        ['primary', 'secondary', 'danger', 'text'].includes(value),
    },
  },
}
</script>

<style lang="scss" scoped>
.base-button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;

  transition: background-color 0.3s;
  cursor: pointer;
  margin: 0;
  outline: none;
  border: none;
  border-radius: 4px;
  background: none;
  padding: 8px 16px;
  font-size: 14px;
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-button:hover:enabled {
  opacity: 0.8;
}

.base-button--primary {
  background-color: var(--color-button-background);
  color: var(--color-button-foreground);
}

.base-button--secondary {
  background-color: var(--color-button-background-secondary);
  color: var(--color-button-foreground-secondary);
}

.base-button--danger {
  background-color: var(--color-danger-background);
  color: var(--color-danger-foreground);
}

.base-button--text {
  background-color: transparent;
  color: var(--color-button-foreground);
}
</style>
