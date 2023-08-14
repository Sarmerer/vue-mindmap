<template>
  <div class="setting">
    <BaseSelect
      :value="setting.value"
      :options="setting.options"
      :reduce="(s) => s.value"
      :label="(s) => s.label"
      @input="change" />

    <label class="setting__label" v-text="setting.label"></label>
  </div>
</template>

<script>
import { Mindmap } from '../../../types/mindmap'

export default {
  props: {
    setting: {
      type: Mindmap,
      required: true,
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
  width: 100%;
}

.setting__label {
  white-space: nowrap;
}
</style>
