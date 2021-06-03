<template>
  <div>
    <emoji-picker ref="picker" @pick="emojiPick"></emoji-picker>
    <card
      v-for="card in cards"
      :key="card.id"
      :card="card"
      @open-picker="openPicker"
      @close-picker="closePicker"
    ></card>
  </div>
</template>
<script>
import { mapState } from "vuex";

import Card from "@/components/Card";
import EmojiPicker from "@/components/EmojiPicker";

export default {
  components: {
    Card,
    EmojiPicker,
  },
  computed: {
    ...mapState(["cards"]),
  },
  data() {
    return {
      target: null,
    };
  },
  methods: {
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
<style lang="scss" scoped></style>
