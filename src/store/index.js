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
    cards: [],
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
      state.cards.push(card);
    },
    addCardToGroup: function (state, { cardID, groupID }) {
      const cardIndex = state.cards.findIndex((c) => c.id === cardID);
      if (cardIndex < 0) return;
      state.cards[cardIndex].group = groupID;
      const groupCardsAmount =
        state.cards.filter((c) => c.group === groupID) || [];
      state.cards[cardIndex].orderInGroup =
        groupCardsAmount > 0 ? groupCardsAmount + 1 : 0;
    },
    setCardOrder: function (state, { cardID, newIndex }) {
      const cardIndex = state.cards.findIndex((c) => c.id === cardID);
      if (cardIndex < 0) return;
      state.cards[cardIndex].orderInGroup = newIndex;
    },
    updateCards: function (state, value) {
      state.cards = value;
    },
    deleteCard: function (state, id) {
      const index = state.cards.findIndex((c) => c.id === id);
      if (index < 0) return;
      state.cards.splice(index, 1);
    },
    deleteCardsInGroup: function (state, groupID) {
      const indexes = state.cards
        .map((c, i) => (c.group === groupID ? i : undefined))
        .filter((x) => x !== undefined);

      if (!indexes.length) return;
      for (var i = indexes.length - 1; i >= 0; i--)
        state.cards.splice([indexes[i]], 1);
    },
    deleteAllCards: function (state) {
      state.cardGroups = [];
      state.cards = [];
    },

    /* -------------------------------------------------------------------------- */
    /*                            card group mutatuins                           */
    /* -------------------------------------------------------------------------- */

    createGroup: function (state, group) {
      state.cardGroups.push(group);
    },
    setCardProperty: function (state, { cardID, key, value, keyValues }) {
      const index = state.cards.findIndex((c) => c.id === cardID);
      if (index < 0) return;
      state.cards[index][key] = value;
      if (!keyValues || !Array.isArray(keyValues)) return;
      for (let kv of keyValues) {
        if (typeof kv !== "object" || notDefined(kv.key)) continue;
        state.cards[index][kv.key] === kv.value;
      }
      function notDefined(v) {
        return v === undefined || v === null;
      }
    },
    reorderGroup: function (state, { groupID, priorityIndex, priorityID }) {
      const cards = state.cards
        .filter((c) => c.group === groupID)
        .sort((a, b) => a.orderInGroup - b.orderInGroup);
      const targetCardIndex = cards.findIndex((c) => c.id === priorityID);
      if (targetCardIndex < 0) return;
      cards.splice(priorityIndex, 0, cards.splice(targetCardIndex, 1)[0]);
      for (let i = 0; i < cards.length; i++) {
        if (i === priorityIndex && cards[i].id === priorityID) continue;
        cards[i].orderInGroup = i;
      }
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

    /* -------------------------------------------------------------------------- */
    /*                              document actions                              */
    /* -------------------------------------------------------------------------- */

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

    /* -------------------------------------------------------------------------- */
    /*                                card actions                                */
    /* -------------------------------------------------------------------------- */

    changeCardPosition: ({ commit }, { cardID, groupID, newIndex }) => {
      commit("setCardOrder", { cardID, newIndex });
      commit("reorderGroup", {
        groupID,
        priorityIndex: newIndex,
        priorityID: cardID,
      });
    },

    /* -------------------------------------------------------------------------- */
    /*                             card group actions                             */
    /* -------------------------------------------------------------------------- */

    addCardToGroup: ({ commit }, { cardID, groupID }) => {
      commit("addCardToGroup", { cardID, groupID });
      commit("reorderGroup", { groupID });
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
    cards: (state) => state.cards.filter((c) => !c.group),
    groups: (_, getters) => [
      ...new Set(getters.groupedCards.map((c) => c.group)),
    ],
    groupedCards: (state) =>
      state.cards.filter((c) => typeof c.group === "string"),
    lastDocExists: (state) => !!state.documents[state.settings.lastDocument],
  },
});
