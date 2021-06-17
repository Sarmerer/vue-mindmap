<template>
  <div
    class="card-group"
    :style="{ top: `${group.y}px`, left: `${group.x}px` }"
    @mouseenter="hover"
    @mouseleave="unhover"
  >
    <div class="container">
      <div class="controls">
        <div
          title="Move"
          class="control"
          @mousedown="dragStart"
          :class="{ active: dragging }"
        >
          <b-icon icon="arrows-move"></b-icon>
        </div>
        <div
          title="Order"
          class="control"
          v-if="cards.length > 1 && !showSnaps"
          @click="orderMode = !orderMode"
          :class="{ active: orderMode }"
        >
          <b-icon icon="arrow-left-right"></b-icon>
        </div>
        <div class="control" title="Delete" v-if="!showSnaps">
          <b-icon icon="x" @click="deleteGroup(group.id)"></b-icon>
        </div>
        <div class="control" :class="{ active: showSnaps }">
          <b-icon icon="grid" @click="showSnaps = !showSnaps"></b-icon>
        </div>
        <div class="control" :class="{ active: snap.top }" v-if="showSnaps">
          <b-icon icon="align-top" @click="snapTo('top')"></b-icon>
        </div>
        <div class="control" :class="{ active: snap.right }" v-if="showSnaps">
          <b-icon icon="align-end" @click="snapTo('right')"></b-icon>
        </div>
        <div class="control" :class="{ active: snap.bottom }" v-if="showSnaps">
          <b-icon icon="align-bottom" @click="snapTo('bottom')"></b-icon>
        </div>
        <div class="control" :class="{ active: snap.left }" v-if="showSnaps">
          <b-icon icon="align-start" @click="snapTo('left')"></b-icon>
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
    snap() {
      return this.group.snap || {};
    },
    isSnapped() {
      return Object.values(this.snap).some((s) => s === true);
    },
  },
  watch: {
    snap: {
      deep: true,
      handler: "reposition",
    },
    boundaries(bounds) {
      if (!this.oldBounds) this.oldBounds = bounds;
      this.reposition();
      this.oldBounds = bounds;
    },
  },
  data() {
    return {
      dragging: false,
      shift: { x: 0, y: 0 },
      oldBounds: null,
      orderMode: false,
      showSnaps: false,
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
      // this.resetSnap();
      // this.showSnaps = false;
      const rect = this.$el.getBoundingClientRect();
      this.shift.x = e.clientX - rect.left;
      this.shift.y = e.clientY - rect.top;
    },
    drag(e) {
      if (!this.dragging) return;
      const rect = this.$el.getBoundingClientRect();
      const x = e.clientX - this.shift.x;
      const y = e.clientY - this.shift.y;
      if (
        !this.snap.left &&
        !this.snap.right &&
        x > 0 &&
        x + rect.width <= this.boundaries?.width
      )
        this.group.x = x;
      if (
        !this.snap.top &&
        !this.snap.bottom &&
        y > 0 &&
        y + rect.height <= this.boundaries?.height
      )
        this.group.y = y;
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
    snapTo(side) {
      if (this.group.snap === null || typeof this.group.snap !== "object") {
        this.group.snap = {};
      }
      this.group.snap[side] = !this.group.snap[side];
      this.group.snap[oppoziteSide(side)] = false;

      function oppoziteSide(side) {
        const oppozites = {
          top: "bottom",
          right: "left",
          bottom: "top",
          left: "right",
        };
        return oppozites[side];
      }
    },
    resetSnap() {
      Object.keys(this.group.snap).forEach((k) => (this.group.snap[k] = false));
    },
    reposition() {
      const rect = this.$el.getBoundingClientRect();
      const bounds = this.boundaries;

      let newX, newY;
      if (this.isSnapped) {
        if (this.snap.top) newY = 85;
        if (this.snap.right) newX = bounds.width - rect.width;
        if (this.snap.bottom) newY = bounds.height - rect.height - 10;
        if (this.snap.left) newX = 10;
      } else {
        const xDiff = (bounds?.width || 0) - (this.oldBounds?.width || 0);
        const yDiff = (bounds?.height || 0) - (this.oldBounds?.height || 0);
        newX = this.group.x + xDiff;
        newY = this.group.y + yDiff;
      }

      if (newX >= 0 && newX + rect.width <= bounds.width) this.group.x = newX;
      if (newY >= 0 && newY + rect.height <= bounds.height) this.group.y = newY;
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
      left: 0;
      display: flex;
      // border: 1px solid purple;
      // border-radius: 0.4rem;
      background-color: white;
      z-index: 10;
      .control {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.5rem;
        height: 1.5rem;
        border: 1px solid var(--secondary-clr);

        &.active {
          background-color: rgba($color: purple, $alpha: 0.5);
        }

        &:not(:last-of-type) {
          border-right: none;
        }

        &:first-of-type {
          border-top-left-radius: 0.4rem;
          border-bottom-left-radius: 0.4rem;
        }
        &:last-of-type {
          border-top-right-radius: 0.4rem;
          border-bottom-right-radius: 0.4rem;
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
