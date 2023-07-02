<template>
  <component :size="16" :is="component" />
</template>

<script>
import * as icons from "lucide-vue";

export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
  },

  computed: {
    component() {
      const icon = this.icon
        .split("-")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join("");

      return icons[icon];
    },
  },
};
</script>
