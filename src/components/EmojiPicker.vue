<template>
  <div v-show="shown" class="picker" :style="{ top: `${y}px`, left: `${x}px` }">
    <div
      v-for="(emoji, key) in emojis.emoji"
      :key="key"
      class="emoji"
      :title="key"
      v-text="emoji"
      @click="pick({ key, emoji })"
    ></div>
  </div>
</template>
<script>
import emojis from "node-emoji";

export default {
  data() {
    return {
      emojis,
      shown: false,
      x: 0,
      y: 0,
    };
  },
  methods: {
    open(e) {
      const rect = this.$el.getBoundingClientRect();
      const offset = 20;
      this.x = e.clientX + offset;
      this.y = e.clientY - rect.height - offset;
      this.shown = true;
    },
    close() {
      this.shown = false;
    },
    pick(emoji) {
      this.$emit("pick", emoji);
    },
  },
};
</script>
<style lang="scss" scped>
.picker {
  position: absolute;
  width: auto;
  height: auto;
  max-width: 400px;
  max-height: 300px;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  user-select: none;
  z-index: 51;
  padding: 0.5rem;
  box-sizing: border-box;

  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 0 5px black;
}
</style>
