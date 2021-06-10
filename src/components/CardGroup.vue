<template>
  <div
    class="card-group"
    :style="{ top: `${group.y}px`, left: `${group.x}px` }"
  >
    <div class="container" @drop="cardDrop">
      <div class="controls">
        <div><b-icon icon="x" @click="deleteGroup(group.id)"></b-icon></div>
        <div @mousedown="dragStart"><b-icon icon="arrows-move"></b-icon></div>
      </div>
      <div class="cards">
        <card
          v-for="card in cards"
          :key="card.id"
          :card="card"
          :style="{ 'pointer-events': dragOver ? 'none' : '' }"
          @open-picker="openPicker"
          @close-picker="closePicker"
        ></card>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import Card from "@/components/Card";

export default {
  props: {
    group: { required: true },
  },
  components: {
    Card,
  },
  computed: {
    ...mapGetters(["groupedCards"]),

    cards() {
      const cards =
        this.groupedCards.filter((c) => this.group.id === c.group) || [];
      if (!cards.length) return this.deleteGroup(this.group.id);
      return cards;
    },
  },
  data() {
    return {
      dragging: false,
      shift: { x: 0, y: 0 },
      dragOver: false,
    };
  },
  mounted() {
    window.addEventListener("mousemove", this.drag);
    window.addEventListener("mouseup", this.dragStop);
  },
  methods: {
    ...mapMutations(["setCardProperty", "deleteGroup"]),
    dragleave() {
      console.log("leave");
    },
    cardDrop(e) {
      const cardID = e.dataTransfer.getData("cardID");
      if (!cardID)
        return console.warn(
          "`cardID` property not set in `dataTransfer` property of `event` could not drop card"
        );
      this.setCardProperty([cardID, "group", this.group.id]);
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
    openPicker([e]) {
      this.$refs.picker.open(e);
    },
    closePicker(cardID) {
      if (this.target !== cardID) return;
      this.$refs.picker.close();
      this.target = null;
    },
    emojiPick(emoji) {
      const index = this.groupedCards.findIndex((c) => c.id === this.target);
      if (index < 0) return;
      this.groupedCards[index].icon = emoji.emoji;
    },
  },
};
</script>
<style lang="scss" scoped>
.card-group {
  position: absolute;
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
          border-right: 1px solid purple;
        }
      }
    }
  }
}
.cards {
  border: 1px solid black;
  border-radius: 0.5rem;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
}
</style>
