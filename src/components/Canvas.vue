<template>
  <div
    class="canvas"
    @mousedown.stop="canvas.pan($event)"
    @wheel.prevent.stop="canvas.zoom($event)"
    @mousedown.middle.prevent.stop="canvas.reset()"
  >
    <div :id="canvas.id" class="canvas__content" :style="{ transform }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { Canvas } from "../types/canvas";

export default {
  props: {
    canvas: {
      type: Canvas,
      required: true,
    },
  },

  computed: {
    transform() {
      return `translate3d(${this.canvas.offsetX}px, ${this.canvas.offsetY}px, 0) scale(${this.canvas.scale})`;
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
