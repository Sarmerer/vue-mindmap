<template>
  <label class="base-toggle" role="checkbox" @keydown.space.prevent="keyToggle">
    <input
      class="base-toggle__input"
      type="checkbox"
      :checked="value"
      tabindex="-1"
      @change.stop="$emit('input', $event.target.checked)"
    />

    <div class="base-toggle__slider"></div>
    <span class="base-toggle__label" v-text="label"></span>
  </label>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },

    label: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped>
.base-toggle {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.base-toggle__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.base-toggle__slider {
  position: relative;
  transition: background-color 0.2s;
  border-radius: 10px;
  background-color: #ccc;
  width: 40px;
  height: 20px;
}

.base-toggle__slider:before {
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.2s;
  border-radius: 50%;
  background-color: #fff;
  width: 16px;
  height: 16px;
  content: '';
}

.base-toggle__input:checked + .base-toggle__slider {
  background-color: #2196f3;
}

.base-toggle__input:checked + .base-toggle__slider:before {
  transform: translateX(20px);
}

.base-toggle__label {
  margin-left: 8px;
}
</style>
