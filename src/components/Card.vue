<template>
  <div
    class="card-container"
    :style="{ top: `${card.y}px`, left: `${card.x}px` }"
  >
    <div class="card-overlay">
      <div
        ref="card"
        class="playing-card"
        @mousedown.prevent="dragStart"
        @mousemove.stop="drag"
        @mouseup.stop="dragStop"
        @mouseleave="dragStop"
        @click="focused = true"
        v-on-clickaway="clickOutside"
      >
        <div class="text">
          <div
            class="icon"
            @click.prevent="$emit('open-picker', [$event, card.id])"
            @mouseover="iconHover = true"
            @mouseleave="iconHover = false"
          >
            <b-icon icon="pencil" v-if="!card.icon && iconHover"></b-icon>
            {{ card.icon }}
          </div>

          <span v-if="!card.editing" v-text="card.text"></span>
          <textarea
            v-else
            placeholder="Card text..."
            v-model="card.text"
            ref="textarea"
            rows="7"
            @click="focusTextarea"
            @mousedown.stop
            @keydown.enter.exact.stop="card.editing = false"
            @keydown.stop
          ></textarea>
        </div>
      </div>
      <div v-if="focused" class="controls">
        <button @click="card.editing = !card.editing">
          <b-icon icon="pencil"></b-icon>
        </button>
        <button @click="deleteCard(card.id)"><b-icon icon="x"></b-icon></button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import { mixin as clickaway } from "vue-clickaway2";
import Vue from "vue";

export default {
  mixins: [clickaway],
  props: {
    card: { required: true },
  },
  data() {
    return {
      shift: { x: 0, y: 0 },
      dragging: false,
      focused: false,
      iconHover: false,
    };
  },
  created() {
    Vue.directive("click-outside", {
      bind: function (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
          if (!(el == event.target || el.contains(event.target))) {
            vnode.context[binding.expression](event);
          }
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
      },
      unbind: function (el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
      },
    });
  },
  methods: {
    ...mapMutations(["deleteCard"]),
    dragStart(e) {
      this.dragging = true;
      const rect = this.$refs.card.getBoundingClientRect();
      this.shift.x = e.clientX - rect.left;
      this.shift.y = e.clientY - rect.top;
    },
    drag(e) {
      if (!this.dragging) return;
      const x = e.clientX - this.shift.x;
      const y = e.clientY - this.shift.y;
      if (x > 0) this.card.x = x;
      if (y > 0) this.card.y = y;
    },
    dragStop() {
      this.dragging = false;
    },
    focusTextarea() {
      this.$nextTick(() => this.$refs.textarea.focus());
    },
    clickOutside() {
      this.focused = false;
      this.$emit("close-picker", this.card.id);
    },
  },
};
</script>
<style lang="scss" scoped>
.playing-card {
  position: relative;
  padding: 0.5rem;
  user-select: none;
  border-radius: 0.5rem;
  //prettier-ignore
  box-shadow: 0px 0px 20px rgba($color: #000000, $alpha: 0.1),
              0px 0px 5px rgba($color: #000000, $alpha: 0.5);

  width: 120px;
  height: 170px;
  background-color: white;

  .text {
    height: 100%;
    width: 100%;
    overflow: hidden;

    span {
      text-overflow: ellipsis;
      text-overflow: ellipsis;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    textarea {
      margin: 0;
      padding: 0;
      width: 100%;
      box-sizing: border-box;
      resize: none;
    }
  }

  .icon {
    float: right;
    margin: 5px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: rgba($color: grey, $alpha: 0.3);
    }
  }
}

.card-container {
  position: absolute;
  z-index: 20;
  .card-overlay {
    position: relative;
    .controls {
      border: 1px solid var(--secondary-clr);
      border-radius: 0.4rem;
      $height: 1rem;
      position: absolute;
      right: 0.5rem;
      bottom: -2rem;

      button {
        border: none;
        outline: none;
        background-color: white;

        &:first-of-type {
          border-top-left-radius: 0.4rem;
          border-bottom-left-radius: 0.4rem;
        }
        &:last-of-type {
          border-top-right-radius: 0.4rem;
          border-bottom-right-radius: 0.4rem;
        }
        &:not(:last-of-type) {
          border-right: 1px solid var(--secondary-clr);
        }
      }
    }
  }
}
</style>
