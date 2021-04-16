<template>
  <div class="docs" v-on-clickaway:mousedown="close">
    <button class="doc-menu-toggle" @click="showMenu = !showMenu">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-file-earmark-text"
        viewBox="0 0 16 16"
      >
        <path
          d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"
        />
        <path
          d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"
        />
      </svg>
    </button>
    <div class="doc-menu" v-show="showMenu">
      <button class="doc-new" @click="createNewDocument">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-file-earmark-plus"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5z"
          />
          <path
            d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"
          />
        </svg>
      </button>
      <div class="doc-list">
        <div
          class="doc"
          :class="{ active: activeDoc(uuid) }"
          v-for="(doc, uuid) in documents"
          :key="uuid"
          @click="setDocument(uuid)"
        >
          <div v-if="!doc.editing" class="content">
            <span class="doc-name">{{ doc.name }}</span>
            <span>
              <span v-if="doc.lastEdit" class="doc-date">{{
                timeAgo(doc.lastEdit)
              }}</span>
              <!-- <button @click.stop="toggleDocumentEdit(doc)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pencil-square"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                  />
                </svg>
              </button> -->
              <button @click.stop="deleteDocument(uuid)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-trash"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                  />
                </svg>
              </button>
            </span>
          </div>
          <div v-else class="content">
            <input type="text" v-model="doc.name" />
            <button @click="toggleDocumentEdit(doc)"></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { store } from "@/store2.0";
import { tree } from "@/tree";
import { mixin as clickaway } from "vue-clickaway2";

export default {
  name: "DocumentsList",
  mixins: [clickaway],
  data() {
    return {
      store,
      showMenu: false,
    };
  },
  computed: {
    documents() {
      return store.state.documents;
    },
  },
  methods: {
    ...mapActions({
      setDocumentAction: "setDocument",
      createDocumentAction: "createDocument",
      deleteDocumentAction: "deleteDocument",
    }),
    setDocument(uuid) {
      this.setDocumentAction(uuid).then((data) => tree.parseTreeData(data));
    },
    createNewDocument() {
      this.createDocumentAction().then((data) => tree.parseTreeData(data));
    },
    toggleDocumentEdit(doc) {
      this.$set(doc, "editing", !doc.editing);
    },
    deleteDocument(uuid) {
      this.deleteDocumentAction(uuid).then((data) => {
        if (this.activeDoc(uuid)) tree.parseTreeData(data);
      });
    },
    activeDoc(id) {
      return id === store.state.settings.lastDocument;
    },
    timeAgo(ts) {
      const date = new Date(ts);
      // prettier-ignore
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${date.getHours()}:${date.getMinutes()} ${date.getDate()} ${
        months[date.getMonth()]
      }`;
    },
    close() {
      if (this.showMenu) this.showMenu = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.docs {
  display: flex;
  align-items: flex-start;
  user-select: none;
  flex-direction: row-reverse;

  .doc-menu {
    background-color: white;
    border-radius: 0.2rem;
    position: relative;
    margin-right: 1rem;
    padding: 0.5rem;
  }

  .doc-list {
    background-color: #e6e6e6;
    padding: 0.5rem;
    border-radius: 0.2rem;
    margin-top: 0.5rem;
    border: 1px solid #b3b3b3;
    .doc > .content {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 2rem;
      align-items: center;
      padding: 0.2rem;
      border-radius: 0.2rem;

      .doc-date {
        font-size: 0.8rem;
      }
      span {
        padding: 0;
        margin: 0;
      }

      button {
        margin-left: 0.5rem;
      }
    }
    .doc:not(:last-child) {
      margin-bottom: 0.5rem;
    }
    .doc.active {
      color: var(--primary-clr);
      background-color: var(--secondary-clr);
    }
  }
}
</style>
