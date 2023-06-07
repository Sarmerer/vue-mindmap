<template>
  <div class="wrapper">
    <tabs>
      <tab name="Import From File">
        <div class="import-tab">
          <div class="checkbox" :class="{ checked: importToSelectedNode }">
            <label class="checkbox-label" for="import-to-selected-from-file"
              >Import to selected node</label
            >
            <input
              type="checkbox"
              id="import-to-selected-from-file"
              v-model="importToSelectedNode"
            />
          </div>

          <span>
            <input type="file" ref="file" @change="fileChange" />
          </span>
          <div class="import-button">
            <button @click="importFromFile">Import</button>
          </div>
        </div>
      </tab>
      <tab name="Import From Clipboard">
        <div class="import-tab">
          <small
            >This feature requires Clipboard permission and doesn't work if it's
            not granted</small
          >
          <div class="checkbox" :class="{ checked: importToSelectedNode }">
            <label
              class="checkbox-label"
              for="import-to-selected-from-clipboard"
              >Import to current node</label
            >
            <input
              type="checkbox"
              id="import-to-selected-from-clipboard"
              v-model="importToSelectedNode"
            />
          </div>
          <div class="import-button">
            <button @click="importFromClipboard">Import</button>
          </div>
        </div>
      </tab>
    </tabs>
  </div>
</template>
<script>
import { tree } from "@/tree";
import Tabs from "@/components/base/Tabs";
import Tab from "@/components/base/Tab";

export default {
  name: "ImportJSON",
  components: { Tabs, Tab },
  data() {
    return {
      file: null,
      importToSelectedNode: false,
    };
  },

  methods: {
    fileChange() {
      this.file = this.$refs.file.files[0];
      if (!this.file) return;
      if (this.file?.type !== "application/json") {
        this.file = null;
        return alert("Improted file should have .json extension");
      }
    },
    importFromFile() {
      if (!this.file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target?.result) return;
        tree.import(JSON.parse(e.target.result));
        this.$modal.hide("import-export-modal");
      };

      reader.readAsText(this.file);
    },
    importFromClipboard() {
      navigator.clipboard
        .readText()
        .then((text) => {
          tree.import(JSON.parse(text));
          this.$modal.hide("import-export-modal");
        })
        .catch((err) => {
          alert(
            "Failed to import from clipboard\nYou see this error either becuase there Clipboard permission is not granted,\nor clipboard content is not a valid JSON",
            err
          );
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  padding: 0.5rem;

  label:not(.checkbox-label) {
    display: block;
    font-size: 0.9rem;
    margin: 0;
  }
  .import-tab {
    display: flex;
    flex-direction: column;

    .row {
      display: flex;
      justify-content: space-around;
    }

    .import-button {
      align-self: flex-end;
    }
  }
}
</style>
