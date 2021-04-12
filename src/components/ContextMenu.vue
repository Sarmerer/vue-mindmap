<template>
  <div
    ref="contextMenu"
    v-show="shown"
    class="context-menu"
    :style="style"
    tabindex="0"
    v-on-clickaway:mousedown="close"
    @click="close()"
  >
    <slot name="items" />
  </div>
</template>
<script>
import { mixin as clickaway } from "vue-clickaway2";
export default {
  mixins: [clickaway],
  computed: {
    style() {
      return { top: `${this.top}px`, left: `${this.left}px` };
    },
  },
  data() {
    return {
      top: 0,
      left: 0,
      shown: false,
    };
  },
  methods: {
    open(event) {
      if (!event) return;
      let eventY = event.pageY || event.clientY;
      let eventX = event.pageX || event.clientX;
      let menuHeight = this.$refs?.contextMenu?.clientHeight || 170;
      let menuWidth = this.$refs?.contextMenu?.clientWidth || 0;
      let newY = eventY;
      let menuBottom = newY + menuHeight;
      let newX = eventX;
      let menuRight = newX + menuWidth;
      if (Math.max(menuBottom, window.innerHeight) === menuBottom) {
        newY -= menuHeight;
      }
      if (Math.max(menuRight, window.innerWidth * 0.5) === menuRight) {
        newX -= menuWidth;
      }
      this.top = newY;
      this.left = newX;
      this.$nextTick(() => this.$el.focus());
      this.shown = true;
    },
    close() {
      if (!this.shown) return;
      this.shown = false;
      this.$emit("close-event");
      this.left = 0;
      this.top = 0;
    },
  },
};
</script>
<style lang="scss" scoped>
.context-menu {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  outline: none;
  position: absolute;
  z-index: 999;
  padding: 0.4rem 0;
  width: auto;
  height: auto;
  border-radius: 0.2rem;
  background-color: var(--context-menu-bg-clr);
}
.context-menu > .context-menu-item {
  transition: background-color 0.2s linear;
  background-color: var(--context-menu-bg-clr);
  color: rgba(255, 255, 255, 0.87);
  text-align: start;
  padding: 0.6rem 3rem 0.4rem 0.5rem;
  margin: 0;
  border: none;
  outline: none;
}
.context-menu > .context-menu-item:hover:enabled {
  background-color: var(--context-menu-item-hover-clr);
}
.context-menu > .context-menu-item:disabled {
  opacity: 0.2;
}
.context-menu > .context-menu-header {
  margin: 0;
  padding: 0;
}

.selector {
  transition: background-color 0.2s linear;
  background-color: var(--context-menu-bg-clr);
  color: rgba(255, 255, 255, 0.87);
  text-align: start;
  padding: 0.6rem 0 0.4rem 0.5rem;
  margin: 0;
  border: none;
  outline: none;
  font-size: 14px;
  width: 94%;
  position: relative;
  &:hover {
    background-color: var(--context-menu-item-hover-clr);
    & ul {
      display: block;
    }
  }
  ul {
    position: absolute;
    display: none;
    left: 100%;
    top: -1rem;
    padding: 0.4rem 0;
    border-radius: 0 0.2rem 0.2rem 0;
    background-color: var(--context-menu-bg-clr);
    overflow: visible;
    width: 8rem;
    list-style: none;
    li {
      transition: background-color 0.2s linear;
      background-color: var(--context-menu-bg-clr);
      color: rgba(255, 255, 255, 0.87);
      text-align: start;
      padding: 0.6rem 0 0.4rem 0.5rem;
      margin: 0;
      border: none;
      outline: none;
      &:hover {
        background-color: var(--context-menu-item-hover-clr);
      }
    }

    &:hover {
      display: block;
    }
  }

  :last-child {
    float: right;
    margin-right: 0.5rem;
  }
}

hr {
  margin: 0 auto;
  width: 70%;
  border: none;
  height: 1px;
  background-color: var(--hr-clr);
  color: var(--hr-clr);
}
</style>
