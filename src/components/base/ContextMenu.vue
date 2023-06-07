<template>
  <div
    v-if="isOpen"
    class="context-menu"
    :style="{ top: `${position.y}px`, left: `${position.x}px` }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
      position: { x: 0, y: 0 },
    };
  },

  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },

  methods: {
    open(event) {
      this.isOpen = true;
      this.position = { x: event.clientX, y: event.clientY };
    },

    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.isOpen = false;
      }
    },
  },
};
</script>

<style>
.context-menu {
  position: fixed;
  z-index: 1000;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.15);
  border: 1px solid #ccc;
  background-color: white;
  padding: 8px;
}
</style>
