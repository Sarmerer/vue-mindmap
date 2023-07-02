<template>
  <transition name="slide">
    <aside class="emoji-bar" v-show="isShown">
      <div class="emoji-bar__search">
        <BaseInput ref="searchInput" v-model="query" @keydown.stop />
      </div>

      <template v-if="favorites.length > 0">
        <EmojiList
          label="Favorites"
          :emojis="favorites"
          @toggle="toggleNodeEmoji"
          @favorite="toggleFavorite"
        />
        <hr />
      </template>

      <template v-if="usedEmojis.length > 0">
        <EmojiList
          label="Used"
          :emojis="usedEmojis"
          @toggle="toggleNodeEmoji"
          @favorite="toggleFavorite"
        />
        <hr />
      </template>

      <EmojiList
        v-bind="{ emojis }"
        @toggle="toggleNodeEmoji"
        @favorite="toggleFavorite"
      />
    </aside>
  </transition>
</template>

<script>
import { Tree } from "../types/tree";

import BaseInput from "./base/Input.vue";
import EmojiList from "./EmojiList.vue";

export default {
  props: {
    tree: {
      type: Tree,
      required: true,
    },
  },

  components: {
    BaseInput,
    EmojiList,
  },

  watch: {
    isShown: {
      immediate: true,
      handler(isShown) {
        if (isShown) {
          setTimeout(() => {
            this.$refs.searchInput.focus();
          }, 200);
        }
      },
    },
  },

  data() {
    return {
      isShown: false,
      query: "",
    };
  },

  computed: {
    emojis() {
      const emojis = this.query
        ? this.tree.emojiManager.search(this.query)
        : this.tree.emojiManager.getAll();

      const used = new Set(this.usedEmojis.map((emoji) => emoji.key));
      return emojis.filter((emoji) => !used.has(emoji.key));
    },

    usedEmojis() {
      if (!this.tree.activeNode) return [];

      return this.tree.emojiManager.extractEmojis(this.tree.activeNode.label);
    },

    favorites() {
      return this.tree.emojiManager.getFavorites();
    },
  },

  created() {
    this.tree.actionsManager.addAction({
      id: "toggle-emoji-bar",
      toolbarGroupId: "right",
      label: "Toggle Emoji Bar",
      icon: "emoji-laughing",
      hotkeys: ["m"],
      run: () => {
        this.isShown = !this.isShown;
      },
    });
  },

  methods: {
    toggleNodeEmoji({ emoji }) {
      this.tree.emojiManager.toggleNodeEmoji(emoji);
    },

    toggleFavorite({ emoji }) {
      this.tree.emojiManager.toggleFavorite(emoji);
    },
  },
};
</script>

<style scoped>
.emoji-bar {
  position: absolute;
  top: 48px;
  right: 0;
  bottom: 0;

  z-index: 2;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
  background-color: var(--color-toolbar-background);
  width: 250px;
  overflow-y: scroll;
  color: var(--color-toolbar-text);
}

.emoji-bar__search {
  padding: 8px;
}

.emoji-bar hr {
  margin: 4px 0;
  border: none;
  border-bottom: 1px solid var(--color-toolbar-separator);
}

.slide-enter-active {
  transition: all 0.2s ease;
}
.slide-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-enter,
.slide-leave-to {
  transform: translateX(10rem);
}
</style>
