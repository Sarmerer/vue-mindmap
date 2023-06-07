<template>
  <div class="canvas" @mousedown="panStart" @wheel="zoom">
    <div
      class="canvas__content"
      :style="{ translate: `${x}px ${y}px`, scale: `${scale}px` }"
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
    };
  },

  methods: {
    panStart(e) {
      const { clientX, clientY } = e;
      const { x, y } = this;

      const mousemove = (e) => {
        const { clientX: x2, clientY: y2 } = e;
        this.x = x + x2 - clientX;
        this.y = y + y2 - clientY;
      };

      const mouseup = () => {
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
      };

      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);
    },

    pan(e) {
      const { clientX, clientY } = e;
      const { x, y } = this;

      this.x = x + clientX;
      this.y = y + clientY;
    },

    zoom(e) {
      const { deltaY } = e;
      const { scale } = this;

      this.scale = scale + deltaY / 1000;
    },
  },
};
</script>

<style scoped>
.canvas {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.canvas__content {
  transform-origin: top left;
  width: 100%;
  height: 100%;
}
</style>
