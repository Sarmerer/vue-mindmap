<template>
  <input
    class="base-input"
    :value="value"
    :type="type"
    :placeholder="placeholder"
    @input="$emit('input', $event.target.value)"
    @keydown.prevent.stop.enter="$emit('enter', $event)"
    @keydown.escape="$emit('escape', $event)"
    @focusout="$emit('focusout', $event)" />
</template>

<script>
export default {
  props: {
    value: {
      default: '',
    },

    type: {
      type: String,
      default: 'text',
    },

    placeholder: {
      type: String,
      default: '',
    },

    autofocus: {
      type: [Boolean, Number],
      default: false,
    },

    autoselect: {
      type: Boolean,
      default: false,
    },
  },

  mounted() {
    this.maybeFocus()
    this.maybeSelect()
  },

  methods: {
    focus() {
      this.$el.focus()
    },

    select() {
      this.$el.select()
    },

    maybeFocus() {
      if (typeof this.autofocus === 'number') {
        setTimeout(() => this.focus(), this.autofocus)
      } else if (this.autofocus) {
        this.focus()
      }
    },

    maybeSelect() {
      if (this.autoselect) {
        this.$el.select()
      }
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
</style>
