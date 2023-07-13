<template>
  <BaseModal ref="modal">
    <div class="transfer">
      <BaseToggle v-model="isImport" :label="title" />
      <BaseToggle v-model="useClipboard" :label="destination" />
      <BaseToggle
        v-if="isImport"
        v-model="useActiveNode"
        :label="useActiveNode ? 'Append To Active Node' : 'Rewrite Tree'"
      />

      <div v-if="isImport && !useClipboard" class="transfer__import__input">
        <input type="file" />
      </div>

      <div
        v-else-if="!isImport && !useClipboard"
        class="transfer__export__input"
      >
        <BaseInput v-model="exportFileName" />
      </div>

      <BaseButton :disabled="canTransfer" @click="transfer">
        {{ title }} {{ destination }}
      </BaseButton>
    </div>
  </BaseModal>
</template>

<script>
import { Tree } from "../../../modules/tree";

export default {
  props: {
    tree: {
      type: Tree,
      required: true,
    },
  },

  data() {
    return {
      isImport: false,
      useClipboard: false,
      useActiveNode: false,

      importFile: null,
      exportFileName: "mindmap",
    };
  },

  computed: {
    title() {
      return this.isImport ? "Import" : "Export";
    },

    prefix() {
      return this.isImport ? "From" : "To";
    },

    destination() {
      const target = this.useClipboard ? "Clipboard" : "File";
      return `${this.prefix} ${target}`;
    },

    canTransfer() {
      return this.isImport
        ? !this.useClipboard && !this.importFile
        : !this.useClipboard && !this.exportFileName;
    },
  },

  mounted() {
    this.tree.actionsManager.addAction({
      id: "transfer",
      toolbarGroupId: "right",
      toolbarOrder: 4.5,
      label: "Transfer",
      icon: "arrow-down-up",
      run: () => {
        this.$refs.modal.open();
      },
    });
  },

  methods: {
    transfer() {
      if (this.isImport) {
        this.import();
      } else {
        this.export();
      }
    },

    import() {
      if (this.useClipboard) {
        this.importFromClipboard();
      } else {
        this.importFromFile();
      }
    },

    importFromClipboard() {
      navigator.clipboard.readText().then((data) => {
        this.tree.deserialize(JSON.parse(data));
        this.$refs.modal.close();
      });
    },

    importFromFile() {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.tree.deserialize(JSON.parse(fileReader.result));
        this.$refs.modal.close();
      };
      fileReader.readAsText(this.importFile);
    },

    export() {
      if (this.useClipboard) {
        this.exportToClipboard();
      } else {
        this.exportToFile();
      }
    },

    exportToClipboard() {
      const data = JSON.stringify(this.tree.serialize());
      navigator.clipboard.writeText(data);
    },

    exportToFile() {
      const data = JSON.stringify(this.tree.serialize());
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${this.exportFileName}.json`;
      a.click();
    },
  },
};
</script>

<style scoped>
.transfer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 300px;
  color: var(--color-main-text);
}
.transfer button {
  align-self: flex-end;
}
</style>
