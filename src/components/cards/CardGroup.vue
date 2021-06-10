<template>
  <div
    class="card-group"
    :style="{ top: `${group.y}px`, left: `${group.x}px` }"
    @mouseenter="hover"
    @mouseleave="unhover"
  >
    <div class="container">
      <div class="controls">
        <div><b-icon icon="x" @click="deleteGroup(group.id)"></b-icon></div>
        <div
          v-if="cards.length > 1"
          @click="orderMode = !orderMode"
          :class="{ active: orderMode }"
        >
          <b-icon icon="arrow-left-right"></b-icon>
        </div>
        <div @mousedown="dragStart" :class="{ active: dragging }">
          <b-icon icon="arrows-move"></b-icon>
        </div>
      </div>

      <draggable
        v-model="cards"
        handle=".handle"
        @change="change"
        animation="200"
        class="cards"
        :class="{ target: isTarget }"
      >
        <div class="card-wrapper" v-for="card in cards" :key="card.id">
          <div v-if="orderMode" class="handle">
            <b-icon icon="grip-horizontal" scale="1"></b-icon>
          </div>
          <card
            :card="card"
            :targetGroup="targetGroup"
            @open-picker="openPicker"
            @close-picker="closePicker"
            @set-dragging-card="$emit('set-dragging-card', $event)"
          ></card>
        </div>
      </draggable>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Card from "./Card";
import draggable from "vuedraggable";

export default {
  props: {
    group: { required: true },
    targetGroup: { default: null },
    draggingCard: { default: false },
    boundaries: { default: null },
  },
  components: {
    draggable,
    Card,
  },
  computed: {
    ...mapGetters(["groupedCards"]),

    cards: {
      get() {
        const cards = this.groupedCards
          .filter((c) => this.group.id === c.group)
          .sort((a, b) => a.orderInGroup - b.orderInGroup);
        if (!cards.length) {
          this.deleteGroup(this.group.id);
          return [];
        }
        return cards;
      },
      set() {},
    },
    isTarget() {
      return this.draggingCard && this.targetGroup === this.group.id;
    },
  },
  watch: {
    boundaries(bounds) {
      if (!this.oldBounds) this.oldBounds = bounds;
      const xDiff = (bounds?.width || 0) - (this.oldBounds?.width || 0);
      const yDiff = (bounds?.height || 0) - (this.oldBounds?.height || 0);
      const newX = this.group.x + xDiff;
      const newY = this.group.y + yDiff;
      if (newX >= 0 && newX <= bounds.width) this.group.x = newX;
      if (newY >= 0 && newY <= bounds.height) this.group.y = newY;
      this.oldBounds = bounds;
    },
  },
  data() {
    return {
      dragging: false,
      shift: { x: 0, y: 0 },
      oldBounds: null,
      orderMode: false,
    };
  },
  mounted() {
    window.addEventListener("mousemove", this.drag);
    window.addEventListener("mouseup", this.dragStop);
  },
  methods: {
    ...mapActions(["changeCardPosition", "deleteGroup"]),
    change(e) {
      const card = e?.moved?.element;
      if (card) {
        this.changeCardPosition({
          cardID: card.id,
          groupID: card.group,
          newIndex: e.moved.newIndex,
        });
      }
    },
    hover() {
      if (!this.draggingCard) return;
      this.$emit("set-target-group", this.group.id);
    },
    unhover() {
      if (!this.draggingCard) return;
      this.$emit("set-target-group", null);
    },
    dragStart(e) {
      this.dragging = true;
      const rect = this.$el.getBoundingClientRect();
      this.shift.x = e.clientX - rect.left;
      this.shift.y = e.clientY - rect.top;
    },
    drag(e) {
      if (!this.dragging) return;
      const x = e.clientX - this.shift.x;
      const y = e.clientY - this.shift.y;
      if (x > 0) this.group.x = x;
      if (y > 0) this.group.y = y;
    },
    dragStop() {
      this.dragging = false;
    },
    openPicker(e) {
      this.$emit("open-picker", e);
    },
    closePicker(e) {
      this.$emit("close-picker", e);
    },
  },
};
</script>
<style lang="scss" scoped>
.card-group {
  position: absolute;
  z-index: 20;

  .container {
    position: relative;
    .controls {
      position: absolute;
      top: -1rem;
      right: 0;
      display: flex;
      gap: 0.2rem;
      border: 1px solid purple;
      border-radius: 0.4rem;
      background-color: white;
      z-index: 10;
      div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.5rem;
        height: 1.5rem;

        &:not(:last-of-type) {
          border-right: 1px solid var(--secondary-clr);
        }
      }
    }
  }
}
.cards {
  min-width: fit-content;
  border: 1px solid black;
  border-radius: 0.3rem;
  position: relative;
  display: flex;
  gap: 1rem;
  padding: 1rem;

  .card-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    .handle {
      cursor: ew-resize;
      height: 1rem;
      width: 80%;
      border-radius: 0.3rem;
      margin-bottom: 0.3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba($color: #000000, $alpha: 0.1);
    }
  }

  &.target {
    border: 1px dashed black;
  }
}
</style>
