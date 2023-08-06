<template>
  <button
    :class="['base-button', `base-button--${intent}`]"
    v-bind="$attrs"
    v-on="$listeners"
  >
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

.base-button--primary {
  background-color: var(--color-main-foreground);
  color: var(--color-main-background);
}

.base-button--primary:hover:enabled {
  background-color: var(--color-main-foreground-hover);
}

.base-button--secondary {
  background-color: var(--color-main-background);
  color: var(--color-main-foreground);
}

.base-button--secondary:hover:enabled {
  background-color: var(--color-main-background-hover);
}

.base-button--danger {
  background-color: var(--color-danger-foreground);
  color: var(--color-danger-background);
}

.base-button--danger:hover:enabled {
  background-color: var(--color-danger-foreground-hover);
}

.base-button--text {
  background-color: transparent;
  color: var(--color-main-foreground);
}

.base-button--text:hover:enabled {
  background-color: var(--color-main-background-hover);
}
</style>
