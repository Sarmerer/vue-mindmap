<template>
  <div class="cards-wrapper">
    <div class="cards">
      <emoji-picker ref="picker" @pick="emojiPick"></emoji-picker>
      <card-group
        v-for="group in cardGroups"
        :key="group.id"
        :group="group"
        :boundaries="boundaries"
        :targetGroup="targetGroup"
        :draggingCard="draggingCard"
        @set-dragging-card="setDraggingCard"
        @set-target-group="setTargetGroup"
        @open-picker="openPicker"
        @close-picker="closePicker"
      ></card-group>
      <card
        v-for="card in cards"
        :key="card.id"
        :card="card"
        :targetGroup="targetGroup"
        :boundaries="boundaries"
        @set-dragging-card="setDraggingCard"
        @set-target-group="setTargetGroup"
        @open-picker="openPicker"
        @close-picker="closePicker"
      ></card>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from "vuex";

import Card from "./Card";
import CardGroup from "./CardGroup";
import EmojiPicker from "@/components/EmojiPicker";

export default {
  components: {
    Card,
    EmojiPicker,
    CardGroup,
  },
  computed: {
    ...mapGetters(["cards"]),
    ...mapState(["_cards", "cardGroups"]),
  },
  data() {
    return {
      target: null,
      targetGroup: null,
      draggingCard: false,
      boundaries: null,
    };
  },
  mounted() {
    this.boundaries = this.$el.getBoundingClientRect();
    window.addEventListener("resize", this.align);
  },
  methods: {
    ...mapMutations(["setCardProperty"]),
    align() {
      this.boundaries = this.$el.getBoundingClientRect();
    },
    setTargetGroup(group) {
      this.targetGroup = group;
    },
    setDraggingCard(value) {
      this.draggingCard = value;
    },
    openPicker([e, cardID]) {
      this.target = cardID;
      this.$refs.picker.open(e);
    },
    closePicker(cardID) {
      if (this.target !== cardID) return;
      this.$refs.picker.close();
      this.target = null;
    },
    emojiPick(emoji) {
      const index = this._cards.findIndex((c) => c.id === this.target);
      if (index < 0) return;
      this._cards[index].icon = emoji.emoji;
    },
  },
};
</script>
<style lang="scss" scoped>
.cards-wrapper {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  .cards {
    position: relative;
    height: 100%;
    width: 100%;
  }
}
</style>
