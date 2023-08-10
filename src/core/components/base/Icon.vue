<template>
  <component class="icon" :class="[intent_]" v-bind="{ is, size }" />
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

    intent: {
      type: String,
      default: null,
      validator: (value) =>
        !value || ['danger', 'success', 'warning', 'info'].includes(value),
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

    intent_() {
      if (!this.intent) return null

      return `icon--${this.intent}`
    },
  },
}
</script>

<style scoped>
.icon--danger {
  color: var(--color-danger-background);
}

.icon--success {
  color: var(--color-success-background);
}

.icon--warning {
  color: var(--color-warning-background);
}

.icon--info {
  color: var(--color-info-background);
}
</style>
