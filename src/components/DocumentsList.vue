<template>
  <div class="docs" v-on-clickaway:mousedown="close">
    <modal
      name="import-export-modal"
      :adaptive="true"
      height="auto"
      width="500px"
    ></modal>
    <button class="doc-menu-toggle" @click="showMenu = !showMenu">
      <b-icon icon="file-earmark-text"></b-icon>
    </button>
    <div class="doc-menu" v-show="showMenu">
      <div class="buttons">
        <button class="doc-new" @click="createNewDocument">
          <b-icon icon="file-earmark-plus"></b-icon>
        </button>
        <div class="import-export">
          <button class="doc-export" disabled @click="exportJSON">
            <b-icon icon="upload"></b-icon>
          </button>
          <button class="doc-import" disabled @click="exportJSON">
            <b-icon icon="download"></b-icon>
          </button>
        </div>
      </div>
      <div class="doc-list">
        <div
          class="doc"
          :class="{ active: activeDoc(uuid) }"
          v-for="(doc, uuid) in documents"
          :key="uuid"
          @click="setDocument(uuid)"
        >
          <div v-if="uuid !== editingDoc" class="content">
            <span class="doc-name">{{ doc.name }}</span>
            <span>
              <span v-if="doc.lastEdit" class="doc-date">{{
                timeAgo(doc.lastEdit)
              }}</span>
              <button @click.stop="enterDocEdit(doc, uuid)">
                <b-icon icon="pencil-square"></b-icon>
              </button>
              <button @click.stop="deleteDocument(uuid)">
                <b-icon icon="trash"></b-icon>
              </button>
            </span>
          </div>
          <div v-else class="content">
            <div class="name-input">
              <input
                type="text"
                v-model="newDocName"
                @click.stop
                @keydown.stop
                @keydown.enter="saveDocName(doc)"
                @keydown.esc="leaveDocEdit()"
                @mousewheel.stop
                ref="docNameInput"
              />
            </div>
            <div>
              <button @click="leaveDocEdit(doc)">
                <b-icon icon="x"></b-icon>
              </button>
              <button @click="saveDocName(doc)">
                <b-icon icon="check2"></b-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { store } from "@/store";
import { tree } from "@/tree";
import { mixin as clickaway } from "vue-clickaway2";

export default {
  name: "DocumentsList",
  mixins: [clickaway],
  data() {
    return {
      store,
      newDocName: "",
      editingDoc: "",
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
    enterDocEdit(doc, uuid) {
      this.newDocName = doc.name;
      this.editingDoc = uuid;
      this.$nextTick(() => {
        if (this.$refs.docNameInput && this.$refs.docNameInput[0])
          this.$refs.docNameInput[0].focus();
      });
    },
    leaveDocEdit() {
      this.newDocName = "";
      this.editingDoc = "";
    },
    saveDocName(doc) {
      doc.name = this.newDocName;
      this.leaveDocEdit();
    },
    deleteDocument(uuid) {
      this.deleteDocumentAction(uuid).then((data) => {
        if (!this.activeDoc(uuid)) tree.parseTreeData(data);
      });
    },
    activeDoc(id) {
      return id === store.state.settings.lastDocument;
    },

    exportJSON() {},

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
    position: absolute;
    margin-right: 1rem;
    padding: 0.5rem;
    box-shadow: 0px 0px 5px -2px black;
  }

  .buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: space-between;

    .import-export {
      display: flex;
      gap: 0.5rem;
    }
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

      .name-input {
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
          padding-left: 0.5rem;
          width: 100%;
          &:focus {
            // border: 2px solid var(--secondary-clr);
            box-shadow: inset 1px 1px 4px 0px rgba(0, 0, 0, 0.75);
          }
        }
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
