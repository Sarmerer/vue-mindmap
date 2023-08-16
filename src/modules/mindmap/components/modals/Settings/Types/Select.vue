<template>
  <BaseSelect
    :value="setting.value"
    :options="setting.options"
    :reduce="(s) => s.value"
    :label="(s) => s.label"
    @input="$emit('change', $event)" />
</template>

<script>
import Setting from '../../../../types/setting'

export default {
  props: {
    setting: {
      type: Setting,
      required: true,
    },
  },
}
</script>
