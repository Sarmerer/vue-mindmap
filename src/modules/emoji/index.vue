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
          @toggle="toggleEmoji"
          @favorite="toggleFavorite" />
        <hr />
      </template>

      <template v-if="usedEmojis.length > 0">
        <EmojiList
          label="Used"
          :emojis="usedEmojis"
          @toggle="removeEmoji"
          @favorite="toggleFavorite" />
        <hr />
      </template>

      <EmojiList
        v-bind="{ emojis }"
        @toggle="addEmoji"
        @favorite="toggleFavorite" />
    </aside>
  </transition>
</template>

<script>
import { Mindmap } from '../mindmap'

import EmojiList from './components/EmojiList.vue'

export default {
  props: {
    mindmap: {
      type: Mindmap,
      required: true,
    },
  },

  components: { EmojiList },

  watch: {
    isShown: {
      immediate: true,
      handler(isShown) {
        if (isShown) {
          setTimeout(() => {
            this.$refs.searchInput.focus()
          }, 200)
        }
      },
    },

    'mindmap.activeElement': {
      immediate: true,
      handler(element) {
        if (!this.isShown) return

        this.isShown = element?.emoji != null
      },
    },
  },

  data() {
    return {
      isShown: false,
      query: '',
    }
  },

  computed: {
    emojis() {
      const emojis = this.query
        ? this.mindmap.emoji.search(this.query)
        : this.mindmap.emoji.getAll()

      const used = new Set(this.usedEmojis.map((emoji) => emoji.key))
      return emojis.filter((emoji) => !used.has(emoji.key))
    },

    usedEmojis() {
      if (!this.mindmap.activeElement?.emoji) return []

      return this.mindmap.activeElement.emoji.getEmoji()
    },

    favorites() {
      return this.mindmap.emoji.getFavorites()
    },
  },

  created() {
    this.mindmap.actions.addAction({
      id: 'toggle-emoji-bar',
      toolbarGroupId: 'right',
      label: 'Toggle Emoji Bar',
      icon: 'smile-plus',
      hotkeys: ['m'],
      when: ({ activeElement }) => activeElement?.emoji != null,
      run: () => {
        this.isShown = !this.isShown
      },
    })
  },

  methods: {
    toggleFavorite({ emoji }) {
      this.mindmap.emoji.toggleFavorite(emoji)
    },

    toggleEmoji(emoji) {
      const applicable = this.mindmap.activeElement?.emoji
      if (!applicable) return

      const used = applicable.getEmoji()
      const index = used.findIndex((e) => e.key === emoji.key)
      if (index === -1) {
        this.addEmoji(emoji)
      } else {
        this.removeEmoji(emoji)
      }
    },

    addEmoji({ emoji }) {
      const applicable = this.mindmap.activeElement?.emoji
      if (!applicable) return

      applicable.addEmoji(emoji)
    },

    removeEmoji({ emoji }) {
      const applicable = this.mindmap.activeElement?.emoji
      if (!applicable) return

      applicable.removeEmoji(emoji)
    },
  },
}
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
  border-bottom: 1px solid var(--color-toolbar-border);
}

.slide-enter-active {
  transition: transform 0.2s ease;
}
.slide-leave-active {
  transition: transform 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-enter,
.slide-leave-to {
  transform: translateX(10rem);
}
</style>
