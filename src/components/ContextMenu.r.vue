<template>
  <ul
    v-show="isShown"
    ref="contextMenu"
    class="context-menu"
    :style="{
      translate: `${x}px ${y}px`,
    }"
  >
    <slot></slot>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      x: 0,
      y: 0,
      isShown: false,
    };
  },

  methods: {
    show(e) {
      this.x = e.clientX;
      this.y = e.clientY;
      this.isShown = true;

      window.addEventListener("click", this.maybeHide);
    },

    hide() {
      this.isShown = false;
      window.removeEventListener("click", this.maybeHide);
    },

    maybeHide(e) {
      if (this.$el.contains(e.target)) return;

      this.hide();
    },
  },
};
</script>

<style scoped>
.context-menu {
  position: absolute;
  transform-origin: top left;
  z-index: 1;
  margin: 0;
  padding: 0;
  list-style: none;
}

.context-menu li {
  cursor: pointer;
}
</style>
