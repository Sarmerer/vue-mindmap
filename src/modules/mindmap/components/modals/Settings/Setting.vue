<template>
  <div class="setting">
    <component :is="component" :setting="setting" @change="change" />

    <label class="setting__label" v-text="setting.label"></label>
  </div>
</template>

<script>
import { Mindmap } from '../../../types/mindmap'

import Toggle from './Types/Toggle.vue'
import Select from './Types/Select.vue'

export default {
  props: {
    setting: {
      type: Mindmap,
      required: true,
    },
  },

  components: {
    Toggle,
    Select,
  },

  computed: {
    component() {
      if (typeof this.setting.value === 'boolean') {
        return Toggle
      }

      if (Array.isArray(this.setting.options)) {
        return Select
      }

      return null
    },
  },

  methods: {
    change(value) {
      this.setting.set(value)
    },
  },
}
</script>

<style scoped>
.setting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.setting__label {
  white-space: nowrap;
}
</style>
