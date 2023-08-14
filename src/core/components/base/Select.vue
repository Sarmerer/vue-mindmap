<template>
  <select
    class="base-select"
    :value="value"
    @input="$emit('input', $event.target.value)">
    <option v-for="option in options" :value="reduce(option)">
      {{ label(option) }}
    </option>
  </select>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },

    options: {
      type: Array,
      default: () => [],
    },

    label: {
      type: Function,
      default: (option) => option,
    },

    reduce: {
      type: Function,
      default: (option) => option,
    },
  },
}
</script>

<style scoped>
.base-input {
  border: 1px solid var(--color-input-border);
  border-radius: 4px;

  background-color: var(--color-input-background);
  width: 100%;
  color: var(--color-input-text);
  font-size: 16px;
}

.base-input:focus {
  outline: none;
  border-color: var(--color-input-border-focus);
  background-color: var(--color-input-background-focus);
}

.base-select {
  border: 1px solid var(--color-input-border);
  border-radius: 4px;

  background-color: var(--color-input-background);
  width: 100%;
  color: var(--color-input-text);
  font-size: 16px;
}

.base-select:focus {
  outline: none;
  border-color: var(--color-input-border-focus);
  background-color: var(--color-input-background-focus);
}

.base-select option {
  background-color: var(--color-input-background);
  color: var(--color-input-text);
}
</style>
