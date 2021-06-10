<template>
  <div class="cards-wrapper">
    <div class="cards">
      <emoji-picker ref="picker" @pick="emojiPick"></emoji-picker>
      <card-group
        v-for="group in cardGroups"
        :key="group.id"
        :group="group"
      ></card-group>
      <card
        v-for="card in cards"
        :key="card.id"
        :card="card"
        @open-picker="openPicker"
        @close-picker="closePicker"
      ></card>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from "vuex";

import Card from "@/components/Card";
import EmojiPicker from "@/components/EmojiPicker";
import CardGroup from "@/components/CardGroup";

export default {
  components: {
    Card,
    EmojiPicker,
    CardGroup,
  },
  computed: {
    ...mapGetters(["cards"]),
    ...mapState(["cardGroups"]),
  },
  data() {
    return {
      target: null,
    };
  },
  methods: {
    ...mapMutations(["setCardProperty"]),
    cardDrop(e) {
      console.log("fire");
      if (!e?.dataTransfer) return;
      const cardID = e.dataTransfer.getData("cardID");
      if (!cardID)
        return console.warn(
          "`cardID` property not set in `dataTransfer` property of `event` could not drop card"
        );
      this.setCardProperty([cardID, "group", null]);
      this.setCardProperty([cardID, "x", e.clientX]);
      this.setCardProperty([cardID, "y", e.clientY]);
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
      const index = this.cards.findIndex((c) => c.id === this.target);
      if (index < 0) return;
      this.cards[index].icon = emoji.emoji;
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
