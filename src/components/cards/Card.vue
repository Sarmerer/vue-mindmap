<template>
  <div
    class="card-container"
    :class="{ 'on-top': card.focused }"
    :style="{
      top: `${card.y}px`,
      left: `${card.x}px`,
      position: isChild ? 'static' : 'absolute',
      'pointer-events': card.noPointerEvents ? 'none' : 'auto',
    }"
    @mousedown="dragStart"
    @click="focusCard(true)"
    v-on-clickaway="clickOutside"
  >
    <div class="card-overlay">
      <div ref="card" class="playing-card">
        <!-- @dragend="dragEnd" -->
        <div class="text">
          <div
            class="icon"
            @click.prevent="$emit('open-picker', [$event, card.id])"
            @mouseover="iconHover = true"
            @mouseleave="iconHover = false"
          >
            <b-icon
              icon="pencil"
              v-if="!card.icon && iconHover"
              scale="0.8"
            ></b-icon>
            {{ card.icon }}
          </div>

          <span v-if="!card.editing" v-text="card.text"></span>
          <textarea
            v-else
            placeholder="Card text..."
            v-model="card.text"
            ref="textarea"
            rows="3"
            @click="focus"
            @mousedown.stop
            @keydown.enter.exact.stop="card.editing = false"
            @keydown.stop
          ></textarea>
        </div>
      </div>
      <div v-if="card.focused" class="controls">
        <button @click="deleteCard(card.id)">
          <b-icon icon="x" scale="0.7"></b-icon>
        </button>
        <button @click="edit">
          <b-icon icon="pencil" scale="0.7"></b-icon>
        </button>

        <button @click="group">
          <b-icon icon="grid" scale="0.7"></b-icon>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations } from "vuex";
import { mixin as clickaway } from "vue-clickaway2";
import { CardGroup } from "@/card-group";

export default {
  mixins: [clickaway],
  props: {
    card: { required: true },
    targetGroup: { default: null },
    boundaries: { default: null },
  },
  computed: {
    isChild() {
      return !!this.card.group;
    },
  },
  watch: {
    boundaries(bounds) {
      if (this.isChild) return;
      if (!this.oldBounds) this.oldBounds = bounds;
      const xDiff = (bounds?.width || 0) - (this.oldBounds?.width || 0);
      const yDiff = (bounds?.height || 0) - (this.oldBounds?.height || 0);
      const newX = this.card.x + xDiff;
      const newY = this.card.y + yDiff;
      if (newX >= 0 && newX <= bounds.width) this.card.x = newX;
      if (newY >= 0 && newY <= bounds.height) this.card.y = newY;
      this.oldBounds = bounds;
    },
  },
  data() {
    return {
      shift: { x: 0, y: 0 },
      origin: { x: 0, y: 0 },
      cardClone: null,
      dragging: false,
      iconHover: false,
      oldBounds: null,

      cardWidth: 120,
      cardHeight: 170,
    };
  },
  created() {
    window.addEventListener("mousemove", this.drag);
    window.addEventListener("mouseup", this.dragEnd);
  },
  methods: {
    ...mapMutations([
      "addCard",
      "setCardDProperty",
      "createGroup",
      "deleteCard",
    ]),
    ...mapActions(["addCardToGroup"]),
    dragStart(e) {
      const rect = this.$refs.card.getBoundingClientRect();
      this.shift.x = e.clientX - rect.left;
      this.shift.y = e.clientY - rect.top;
      this.origin.x = rect.left;
      this.origin.y = rect.top;

      this.dragging = true;
      this.$emit("set-dragging-card", true);
    },
    drag(e) {
      if (!this.dragging) return;
      const x = e.clientX - this.shift.x;
      const y = e.clientY - this.shift.y;
      if (
        (this.isChild && Math.abs(this.origin.x - x) > 100) ||
        Math.abs(this.origin.y - y) > 100
      ) {
        this.ungroup();
      }

      if (x > 0 && this.inbound("width", x)) this.card.x = x;
      if (y > 0 && this.inbound("height", y)) this.card.y = y;
      this.card.noPointerEvents = true;
    },
    dragEnd() {
      if (!this.dragging) return;
      if (this.targetGroup) {
        this.addCardToGroup([this.card.id, this.targetGroup]);
        // this.$set(this.card, "group", this.targetGroup);
      }
      this.dragging = false;
      this.card.noPointerEvents = false;
      this.$emit("set-target-group", null);
      this.$emit("set-dragging-card", false);
    },
    inbound(axis, n) {
      return this.boundaries
        ? n + this.cardWidth <= this.boundaries[axis]
        : true;
    },
    focus() {
      this.$nextTick(() => this.$refs.textarea.focus());
    },
    focusCard(value) {
      this.card.focused = !!value;
    },
    edit() {
      this.card.editing = !this.card.editing;
      if (this.card.editing) this.$nextTick(this.focus);
    },
    clickOutside() {
      this.focusCard(false);
      this.$emit("close-picker", this.card.id);
    },
    group() {
      const group = new CardGroup(this.card.x, this.card.y, [this.card.id]);
      this.createGroup(group);
      this.addCardToGroup([this.card.id, group.id]);
    },
    ungroup() {
      this.$set(this.card, "group", null);
    },
  },
};
</script>
<style lang="scss" scoped>
.playing-card {
  position: relative;
  padding: 0.2rem;
  user-select: none;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  //prettier-ignore
  box-shadow: 0px 0px 20px rgba($color: #000000, $alpha: 0.1),
              0px 0px 5px rgba($color: #000000, $alpha: 0.5);

  width: 80px;
  height: 120px;
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
      border-radius: 0.3rem;
      outline: none;
    }
  }

  .icon {
    float: right;
    margin: 5px;
    width: 20px;
    height: 20px;
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
  z-index: 20;
  &.on-top {
    z-index: 30;
  }
  .card-overlay {
    position: relative;
    .controls {
      $height: 1rem;
      border: 1px solid var(--secondary-clr);
      border-radius: 0.4rem;
      position: absolute;
      right: 0;
      bottom: -1.8rem;
      display: flex;

      button {
        border: none;
        outline: none;
        width: 1.5rem;
        height: 1.5rem;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;

        &:first-of-type {
          border-top-left-radius: 0.4rem;
          border-bottom-left-radius: 0.4rem;
        }
        &:last-of-type {
          border-bottom-right-radius: 0.4rem;
          border-top-right-radius: 0.4rem;
        }
        &:not(:last-of-type) {
          border-right: 1px solid var(--secondary-clr);
        }
      }
    }
  }
}
</style>
