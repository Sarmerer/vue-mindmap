<template>
  <div>
    <modal name="info-modal" :adaptive="true" height="auto" width="500px">
      <div id="modal">
        <table class="info-table">
          <tr v-for="(e, index) in events" :key="index" class="info-row">
            <td class="info-col-action">
              {{ e.name }}
            </td>
            <td class="info-col-hotkey">
              {{ e.hotkey.join(" / ") }}
            </td>
          </tr>
        </table>
      </div>
    </modal>
    <breadcrumb></breadcrumb>
    <div class="buttons">
      <documents-list
        @doc-create="createNewDocument()"
        @doc-select="setDocument(...$event)"
        @doc-delete="deleteDocument(...$event)"
      ></documents-list>
      <button @click="toggleEmojiBar">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-emoji-smile"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
          />
          <path
            d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"
          />
        </svg>
      </button>
      <button @click="$modal.show('info-modal')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-question"
          viewBox="0 0 16 16"
        >
          <path
            d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"
          />
        </svg>
      </button>
    </div>
    <emoji-bar ref="emojiBar"></emoji-bar>
  </div>
</template>
<script>
import DocumentsList from "@/components/DocumentsList";
import Breadcrumb from "@/components/Breadcrumb";
import EmojiBar from "@/components/EmojiBar";

import { tree } from "@/tree";
import { events } from "@/hotkeys";
import { store } from "@/store";

export default {
  name: "Toolbar",
  components: {
    DocumentsList,
    Breadcrumb,
    EmojiBar,
  },
  data() {
    return {
      tree,
      events,
    };
  },
  methods: {
    setDocument(name) {
      tree.parseTreeData(store.setDocument(name));
    },
    createNewDocument() {
      tree.parseTreeData(store.newDocument());
    },
    deleteDocument(name) {
      tree.parseTreeData(store.deleteDocument(name));
    },
    toggleEmojiBar() {
      this.$refs?.emojiBar?.toggle();
    },
  },
};
</script>
<style lang="scss" scoped>
.buttons {
  position: absolute;
  display: flex;
  gap: 1rem;
  top: 1rem;
  right: 1rem;
  align-items: flex-start;
  z-index: 10;
}

#modal {
  padding: 1rem;
  user-select: none;
  z-index: 1;
  pointer-events: none;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
}

.info-row:nth-child(odd) {
  background-color: rgba(167, 167, 167, 0.408);
}

.info-row > td {
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  border: 1px solid black;
}

.info-col-action {
  width: 50%;
  padding-right: 1rem;
  text-align: right;
}

.info-col-hotkey {
  width: 50%;
  padding-left: 1rem;
  text-align: left;
}

::v-deep button {
  padding: 0.5rem;
  border-radius: 0.4rem;
  border: none;
  z-index: 1;
  color: black;
  background-color: var(--node-bg-clr);
  box-shadow: 0px 0px 5px -2px black;
}

::v-deep button:active {
  top: 1.07rem;
  background-color: var(--primary-clr);
  box-shadow: 0px 0px 4px -2px black;
  border: none;
}

::v-deep button:focus {
  background-color: var(--primary-clr);
  outline: none;
}
</style>
