<template>
  <textarea
    class="base-textarea"
    :value="value_"
    :placeholder="placeholder"
    @input="$emit('input', $event.target.value)"
    @keydown.prevent.stop.enter.exact="$emit('enter', $event)"
    @keydown.escape="$emit('focusout', $event)"
    @keydown.enter.shift.exact.prevent="value_ += '\n'"
    @focusout="$emit('focusout', $event)"
  ></textarea>
</template>

<script>
export default {
  props: {
    value: {
      default: '',
    },

    placeholder: {
      type: String,
      default: '',
    },

    autofocus: {
      type: [Boolean, Number],
      default: false,
    },
  },

  data() {
    return {
      value_: this.value,
    }
  },

  mounted() {
    this.maybeFocus()
  },

  methods: {
    focus() {
      this.$el.focus()
    },

    maybeFocus() {
      if (typeof this.autofocus === 'number') {
        setTimeout(() => this.focus(), this.autofocus)
      } else if (this.autofocus) {
        this.focus()
      }
    },
  },
}
</script>

<style scoped>
.base-textarea {
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
