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
      if (uuid) state.settings.lastDocument = uuid;
    },
    updateDocument: (state, { uuid, data }) => {
      Object.assign(state.documents[uuid], data);
    },
    addDocument: (state, { uuid, document }) => {
      state.documents[uuid] = document;
    },
  },
  actions: {
    getTreeData: ({ state, dispatch }) => {
      if (
        !state.settings.lastDocument ||
        !state.documents[state.settings.lastDocument]
      ) {
        return dispatch("createDocument");
      }
      return state.documents[state.settings.lastDocument].data;
    },
    setDocument: ({ commit, state }, uuid) => {
      if (uuid) commit("setDocument", uuid);
      return state.documents[uuid].data;
    },
    saveDocument: ({ commit, state, getters }, data) => {
      if (!getters.lastDocExists) return;
      commit("updateDocument", {
        uuid: state.settings.lastDocument,
        data: { lastEdit: Date.now(), data: data },
      });
    },
    createDocument: (
      { commit, state },
      data = { name: "document", data: {} }
    ) => {
      const uuid = uuidv4();
      commit("addDocument", {
        uuid: uuid,
        document: new Document(data.name, data.data),
      });
      commit("setDocument", uuid);
      return state.documents[uuid].data;
    },
    deleteDocument: ({ commit, state, dispatch }, uuid) => {
      Vue.delete(state.documents, uuid);
      const keys = Object.keys(state.documents);
      if (!keys.length) {
        return dispatch("createDocument");
      } else {
        commit("setDocument", keys[0]);
        return state.documents[keys[0]].data;
      }
    },
  },
  getters: {
    documents: (state) => state.documents,
    treeData: function (state) {
      if (
        !state.settings.lastDocument ||
        !state.documents[state.settings.lastDocument]
      )
        return {};
      return state.documents[state.settings.lastDocument].data;
    },
    lastDocExists: (state) => !!state.documents[state.settings.lastDocument],
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
