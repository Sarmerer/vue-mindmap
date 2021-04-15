import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

class Document {
  constructor(name, data) {
    this.name = name;
    this.data = data;
    this.lastEdit = Date.now();
  }
}

export const store = new Vuex.Store({
  state: {
    favoriteEmojis: [],
    settings: {
      lastDocument: "",
    },
    documents: {},
  },
  plugins: [createPersistedState()],
  mutations: {
    addFavoriteEmoji: function (state, emoji) {
      return state.favoriteEmojis.push(emoji);
    },
    removeFavoriteEmoji: function (state, emoji) {
      return state.favoriteEmojis.splice(
        state.favoriteEmojis.indexOf(emoji),
        1
      );
    },

    setDocument: function (state, uuid) {
      if (!uuid) return;
      state.settings.lastDocument = uuid;
    },
    createDocument: function (state, data = { name: "document", data: {} }) {
      const uuid = uuidv4();
      state.documents[uuid] = new Document(data.name, data.data);
      this.commit("setDocument", uuid);
    },
    saveDocument: function (state, data) {
      if (!state.documents[state.settings.lastDocument]) return;
      state.documents[state.settings.lastDocument].lastEdit = Date.now();
      state.documents[state.settings.lastDocument].data = data;
    },
    deleteDocument: function (state, uuid) {
      delete state.documents[uuid];
      const keys = Object.keys(state.documents);
      if (!keys.length) {
        this.commit("createDocument");
      } else {
        store.commit("setDocument", keys[0]);
      }
    },
  },
  getters: {
    documents: (state) => state.documents,
    treeData: (state) => {
      if (!state.documents[state.settings.lastDocument]) return {};
      return state.documents[state.settings.lastDocument].data;
    },
  },
});

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}
