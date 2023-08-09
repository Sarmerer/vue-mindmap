<template>
  <div class="emoji-list">
    <label v-if="label" class="emoji-list__label" v-text="`${label}:`"></label>
    <div class="emoji-list__emojis">
      <div v-for="emoji in emojis" :key="emoji.key" class="emoji-bar__emoji">
        <div
          class="emoji-list__emoji"
          :title="emoji.key"
          v-text="emoji.emoji"
          @click="$emit('toggle', emoji)"
          @contextmenu.prevent="$emit('favorite', emoji)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    emojis: {
      type: Array,
      required: true,
    },

    label: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped>
.emoji-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
}

.emoji-list__label {
  margin-bottom: 0;
}

.emoji-list__emojis {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.emoji-list__emoji {
  display: flex;
  justify-content: center;
  align-items: center;

  transition: all 0.2s ease;
  cursor: pointer;
  border-radius: 4px;
  width: 26px;
  height: 26px;
  font-size: 18px;
  user-select: none;
}
</style>
