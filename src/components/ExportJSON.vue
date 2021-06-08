<template>
  <div class="wrapper">
    <tabs>
      <tab name="Show In New Tab">
        <div class="export-tab">
          <div class="checkbox" :class="{ checked: exportSelectedNode }">
            <label class="checkbox-label" for="export-selected-new-tab"
              >Export from selected node</label
            >
            <input
              type="checkbox"
              id="export-selected-new-tab"
              v-model="exportSelectedNode"
            />
          </div>
          <div class="export-button">
            <button @click="showInNewTab">Export</button>
          </div>
        </div>
      </tab>
      <tab name="Download File">
        <div class="export-tab">
          <div class="row">
            <span class="name-input">
              <label for="export-file-name">Filename</label>
              <input
                id="export-file-name"
                @keydown.stop
                type="text"
                v-model="filename"
                :placeholder="defaultFilename"
              />
            </span>

            <div class="checkbox" :class="{ checked: exportSelectedNode }">
              <label class="checkbox-label" for="export-selected-download"
                >Export from selected node</label
              >
              <input
                type="checkbox"
                id="export-selected-download"
                v-model="exportSelectedNode"
              />
            </div>
          </div>

          <div class="export-button">
            <button @click="downloadFile">Export</button>
          </div>
        </div>
      </tab>
    </tabs>
  </div>
</template>
<script>
import { tree } from "@/tree";
import Tabs from "@/components/common/Tabs";
import Tab from "@/components/common/Tab";

export default {
  name: "ExportJSON",
  components: { Tabs, Tab },
  data() {
    return {
      exportSelectedNode: false,
      filename: "",
      defaultFilename: "tree-data",
    };
  },
  methods: {
    stringifiedTree() {
      return JSON.stringify(
        this.exportSelectedNode ? tree.lastNode.export() : tree.export(),
        null,
        "  "
      );
    },

    showInNewTab() {
      let text = this.stringifiedTree();
      var tab = window.open("about:blank", "_blank");
      tab.document.write(`<pre>${text}</pre>`); // where 'html' is a variable containing your HTML
      tab.document.close(); // to finish loading the page
    },
    downloadFile() {
      let text = this.stringifiedTree();

      let blob = new Blob([text], { type: "application/json" });
      let anchor = document.createElement("a");
      anchor.download = `${this.filename || this.defaultFilename}.json`;
      anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
      anchor.dataset.downloadurl = [
        "application/json",
        anchor.download,
        anchor.href,
      ].join(":");
      anchor.click();
    },
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  padding: 0.5rem;

  .export-tab {
    display: flex;
    flex-direction: column;

    label:not(.checkbox-label) {
      display: block;
      font-size: 0.9rem;
      margin: 0;
    }

    .row {
      display: flex;
      justify-content: space-around;

      div {
        align-self: center;
      }
    }

    .export-button {
      align-self: flex-end;
    }

    .name-input {
      // flex: 1 1 30%;
      input {
        height: 2rem;
        border-radius: 0.4rem;
        border: none;
        outline: none;
        background-color: var(--primary-clr);
        box-sizing: border-box;
        padding-left: 0.5rem;
        &:focus {
          box-shadow: inset 1px 1px 4px -2px rgba(0, 0, 0, 0.75);
        }
      }
    }
  }
}
</style>
