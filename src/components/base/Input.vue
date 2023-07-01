<template>
  <input
    class="base-input"
    :value="value"
    :type="type"
    :placeholder="placeholder"
    @input="$emit('input', $event.target.value)"
  />
</template>

<script>
export default {
  props: {
    value: {
      default: "",
    },

    type: {
      type: String,
      default: "text",
    },

    placeholder: {
      type: String,
      default: "",
    },
  },

  methods: {
    focus() {
      this.$el.focus();
    },
  },
};
</script>

<style scoped>
.base-input {
  border: 1px solid #ccc;
  border-radius: 4px;

  background-color: var(--color-main-background);
  width: 100%;
  color: var(--color-main-text);
  font-size: 16px;
}

.base-input:focus {
  outline: none;
  border-color: var(--color-main-foreground);
}
</style>
