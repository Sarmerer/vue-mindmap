<template>
  <div
    class="canvas"
    @mousedown.stop="panStart"
    @wheel.prevent.stop="zoom"
    @mousedown.middle.prevent.stop="reset"
  >
    <div
      class="canvas__content"
      :style="{
        translate: `${x}px ${y}px`,
        scale: `${scale}`,
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      x: 0,
      y: 0,
      scale: 1,

      initialX: 0,
      initialY: 0,
      cursorX: 0,
      cursorY: 0,
    };
  },

  mounted() {
    window.addEventListener("mousemove", this.updateCursorPosition);
  },

  beforeDestroy() {
    window.removeEventListener("mousemove", this.updateCursorPosition);
  },

  methods: {
    panStart(e) {
      this.initialX = e.clientX;
      this.initialY = e.clientY;

      window.addEventListener("mousemove", this.pan);
      window.addEventListener("mouseup", this.panEnd, { once: true });
    },

    pan() {
      let diffX = this.cursorX - this.initialX;
      let diffY = this.cursorY - this.initialY;
      this.initialX = this.cursorX;
      this.initialY = this.cursorY;
      this.x += diffX;
      this.y += diffY;
    },

    panEnd() {
      window.removeEventListener("mousemove", this.pan);
    },

    zoom(e) {
      const deltaScale = Math.pow(1.1, e.deltaY * -0.01);
      this.scale *= deltaScale;
      const deltaOffsetX = (this.cursorX - this.x) * (deltaScale - 1);
      const deltaOffsetY = (this.cursorY - this.y) * (deltaScale - 1);
      this.x -= deltaOffsetX;
      this.y -= deltaOffsetY;
    },

    updateCursorPosition(e) {
      this.cursorX = e.clientX;
      this.cursorY = e.clientY;
    },

    reset() {
      this.x = 0;
      this.y = 0;
      this.scale = 1;
    },
  },
};
</script>

<style scoped>
.canvas {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.canvas__content {
  transform-origin: center;
  width: 100%;
  height: 100%;
}
</style>
