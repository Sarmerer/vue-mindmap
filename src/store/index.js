import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import { Card } from "../card";
import { uuidv4 } from "../utils";

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
    _cards: [],
    cardGroups: [],
    documents: {},
  },
  plugins: [createPersistedState()],
  mutations: {
    /* -------------------------------------------------------------------------- */
    /*                               emoji mutatuins                              */
    /* -------------------------------------------------------------------------- */
    addFavoriteEmoji: function (state, emoji) {
      return state.favoriteEmojis.push(emoji);
    },
    removeFavoriteEmoji: function (state, emoji) {
      return state.favoriteEmojis.splice(
        state.favoriteEmojis.indexOf(emoji),
        1
      );
    },

    /* -------------------------------------------------------------------------- */
    /*                             document mutations                             */
    /* -------------------------------------------------------------------------- */

    setDocument: function (state, uuid) {
      if (uuid) state.settings.lastDocument = uuid;
    },
    updateDocument: (state, { uuid, data }) => {
      Object.assign(state.documents[uuid], data);
    },
    addDocument: (state, { uuid, document }) => {
      state.documents[uuid] = document;
    },

    /* -------------------------------------------------------------------------- */
    /*                               card mutatuions                              */
    /* -------------------------------------------------------------------------- */

    addCard: function (state, card) {
      if (!(card instanceof Card)) return;
      state._cards.push(card);
    },
    updateCards: function (state, value) {
      state._cards = value;
    },
    deleteCard: function (state, id) {
      const index = state._cards.findIndex((c) => c.id === id);
      if (index < 0) return;
      state._cards.splice(index, 1);
    },
    deleteCardsInGroup: function (state, groupID) {
      const indexes = state._cards.map((c) => c.group === groupID);
      if (!indexes.length) return;
      indexes.sort((a, b) => b - a);
      for (var i = indexes.length - 1; i >= 0; i--)
        state._cards.splice([indexes[i]], 1);
    },
    deleteAllCards: function (state) {
      state.cardGroups = [];
      state._cards = [];
    },

    /* -------------------------------------------------------------------------- */
    /*                            card groups mutatuins                           */
    /* -------------------------------------------------------------------------- */

    createGroup: function (state, group) {
      state.cardGroups.push(group);
    },
    setCardProperty: function (state, [cardID, key, value]) {
      const index = state._cards.findIndex((c) => c.id === cardID);
      if (index < 0) return;
      state._cards[index][key] = value;
    },
    deleteGroup: function (state, id) {
      const index = state.cardGroups.findIndex((g) => g.id === id);
      if (index < 0) return;
      state.cardGroups.splice(index, 1);
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
    deleteGroup: ({ commit }, id) => {
      commit("deleteGroup", id);
      commit("deleteCardsInGroup", id);
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
    cards: (state) => state._cards.filter((c) => !c.group),
    groups: (_, getters) => [
      ...new Set(getters.groupedCards.map((c) => c.group)),
    ],
    groupedCards: (state) =>
      state._cards.filter((c) => typeof c.group === "string"),
    lastDocExists: (state) => !!state.documents[state.settings.lastDocument],
  },
});
