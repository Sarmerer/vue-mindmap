<template>
  <transition name="slide">
    <div class="bar" v-show="shown">
      <div class="title">
        <div class="search">
          <input
            type="text"
            v-model="searchInput"
            @keydown.stop
            @mousewheel.stop
          />
          <span class="input-icon">
            <b-icon icon="search"></b-icon>
          </span>
        </div>
        <button @click="close">
          <b-icon icon="x"></b-icon>
        </button>
      </div>
      <div class="favorites-list" v-if="favorites.length">
        <span class="title">Favorites:</span>
        <div class="flex-wrapper">
          <div v-for="e in favorites" :key="e.key">
            <div
              class="emoji"
              :class="{
                selected: isSelected(e.key),
              }"
              :title="e.key"
              @click="toggleEmoji(e.key)"
              @contextmenu.prevent="toggleFavorite(e.key)"
              v-text="e.emoji"
            ></div>
          </div>
        </div>
        <hr />
      </div>
      <div class="favorites-list" v-if="currentNodeEmoji.length">
        <span class="title">Current node:</span>
        <div class="flex-wrapper">
          <div v-for="e in currentNodeEmoji" :key="e.key">
            <div
              class="emoji"
              :title="e.key"
              @click="toggleEmoji(e.key)"
              @contextmenu.prevent="toggleFavorite(e.key)"
              v-text="e.emoji"
            ></div>
          </div>
        </div>
        <hr />
      </div>
      <div class="emoji-list" v-if="searchInput">
        <div class="flex-wrapper">
          <div v-for="e in searchResult" :key="e.key">
            <div
              class="emoji"
              :class="{
                selected: isSelected(e.key),
              }"
              :title="e.key"
              @click="toggleEmoji(e.key)"
              v-text="e.emoji"
            ></div>
          </div>
        </div>
      </div>
      <div class="emoji-list" v-else>
        <div class="flex-wrapper">
          <div
            v-for="(emoji, key) in emojis.emoji"
            :key="key"
            class="emoji"
            :class="{
              selected: isSelected(key),
            }"
            :title="key"
            @click="toggleEmoji(key)"
            @contextmenu.prevent="toggleFavorite(key)"
            v-text="emoji"
          ></div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import emojis from "node-emoji";
import { store } from "@/store";
import { eventBus } from "@/hotkeys";
import { tree } from "@/tree";

export default {
  name: "EmojiBar",
  data() {
    return {
      emojis,
      tree,
      searchInput: "",
      shown: false,
      favoritesRaw: store.state.favoriteEmojis || [],
    };
  },
  computed: {
    favorites() {
      return this.favoritesRaw.map((e) => emojis.find(e));
    },
    currentNodeEmoji() {
      return this.tree.lastNode?.emoji?.map((e) => emojis.find(e)) || [];
    },
    searchResult() {
      return emojis.search(this.searchInput);
    },
  },
  // TODO use vuex actions instead of mutattions
  methods: {
    toggleEmoji(emoji) {
      if (!emoji) return;
      eventBus.$emit("tree-node-toggle-emoji", emoji);
    },
    toggleFavorite(emoji) {
      if (!emoji) return;
      this.favorites.some((f) => f.key === emoji)
        ? this.removeFavorite(emoji)
        : this.addFavorite(emoji);
    },
    addFavorite(emoji) {
      if (!emoji) return;
      store.commit("addFavoriteEmoji", emoji);
    },
    removeFavorite(emoji) {
      if (!emoji) return;
      store.commit("removeFavoriteEmoji", emoji);
    },
    isSelected(emoji) {
      if (!emoji) return;
      return this.currentNodeEmoji.some((c) => c.key === emoji);
    },
    toggle() {
      this.shown ? this.close() : this.open();
    },
    close() {
      this.shown = false;
    },
    open() {
      this.shown = true;
    },
  },
};
</script>
<style lang="scss">
.bar {
  position: absolute;
  top: 0;
  right: 0;
  max-width: 20rem;
  z-index: 999;
  overflow: auto;
  max-height: 100%;
  background-color: white;
  user-select: none;
  overflow-x: hidden;

  .title {
    text-align: center;
    padding: 0.2rem;
    display: flex;
    align-items: flex-start;
    gap: 0.4rem;
    width: 97%;

    .search {
      position: relative;
      flex-grow: 1;

      input {
        width: 95%;
        height: 2rem;
        border-radius: 0.4rem;
        border: none;
        outline: none;
        background-color: var(--primary-clr);
        box-sizing: border-box;
        padding-left: 2rem;
        width: 100%;
        &:focus {
          // border: 2px solid var(--secondary-clr);
          box-shadow: inset 1px 1px 4px 0px rgba(0, 0, 0, 0.75);
        }
      }

      .input-icon {
        position: absolute;
        top: 0.5rem;
        left: 0.7rem;
      }
    }
    button {
      // width: 1rem;
      height: 2rem;
    }
  }

  .emoji-list,
  .favorites-list {
    .flex-wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: 0.1rem;
    }
    .title {
      width: 100%;
    }

    .emoji {
      box-sizing: border-box;
      border-radius: 0.2rem;
      width: 1.8rem;
      height: 1.8rem;
      text-align: center;
      font-size: 1rem;
      vertical-align: middle;

      &.selected {
        border: 2px solid green;
      }
    }
  }
}

hr {
  width: 80%;
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
