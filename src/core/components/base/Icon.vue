<template>
  <component class="icon" v-bind="{ is, size }" />
</template>

<script>
import * as icons from 'lucide-vue'

export default {
  props: {
    icon: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      default: 16,
    },
  },

  computed: {
    is() {
      const icon = this.icon
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join('')

      return icons[icon]
    },
  },
}
</script>
