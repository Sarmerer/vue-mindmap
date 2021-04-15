import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    favoriteEmojis: [],
  },
  plugins: [createPersistedState()],
  mutations: {
    addFavoriteEmoji: (state, emoji) => state.favoriteEmojis.push(emoji),
    removeFavoriteEmoji: (state, emoji) =>
      state.favoriteEmojis.splice(state.favoriteEmojis.indexOf(emoji), 1),
  },
});
