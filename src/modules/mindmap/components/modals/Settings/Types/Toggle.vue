<template>
  <BaseToggle
    :value="setting.value"
    :description="setting.description"
    :disabled="setting.disabled"
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
