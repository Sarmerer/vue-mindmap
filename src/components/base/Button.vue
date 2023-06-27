<template>
  <button class="base-button" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
.base-button {
  cursor: pointer;
  margin: 0;
  outline: none;
  border: none;
  background: none;
  padding: 0;
}
</style>
