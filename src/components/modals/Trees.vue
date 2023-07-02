<template>
  <BaseModal ref="modal" @close="reset">
    <div class="trees__list">
      <div
        v-for="treeItem in trees"
        :key="treeItem.id"
        class="trees__list__item"
        :class="{
          edited: editedTree?.id === treeItem.id,
          active: treeItem.id === tree.id,
        }"
      >
        <div
          v-if="editedTree !== treeItem"
          class="tree__label"
          @click="setTree(treeItem)"
          v-text="treeItem.label"
        ></div>
        <BaseInput
          v-if="editedTree === treeItem"
          autofocus
          class="tree__label__input"
          :value="treeItem.label"
          @input="setLabel(treeItem, $event)"
          @enter="setEditedTree(null)"
        />

        <div class="tree__actions">
          <BaseButton
            class="tree__actions--edit"
            @click="setEditedTree(editedTree === treeItem ? null : treeItem)"
          >
            <BaseIcon :icon="editedTree === treeItem ? 'check-2' : 'pencil'" />
          </BaseButton>

          <BaseButton
            class="tree__actions--delete"
            @click="deleteTree(treeItem)"
          >
            <BaseIcon icon="trash" />
          </BaseButton>
        </div>
      </div>
    </div>

    <BaseButton
      class="trees__new"
      :class="{
        alone: trees.length === 0,
      }"
      @click="createTree"
    >
      <BaseIcon icon="plus" />
      Create new tree
    </BaseButton>
  </BaseModal>
</template>

<script>
import { Tree } from "../../types/tree";

export default {
  props: {
    tree: {
      type: Tree,
      required: true,
    },
  },

  data() {
    return {
      trees: [],
      editedTree: null,
    };
  },

  created() {
    this.tree.actionsManager.addActions({
      id: "open-trees-modal",
      toolbarGroupId: "right",
      toolbarOrder: 1.5,
      label: "Change tree",
      icon: "save",
      toolbarTitle: "Change tree",
      run: () => {
        this.updateTrees();
        this.$refs.modal.open();
      },
    });
  },

  methods: {
    updateTrees() {
      this.trees = Object.values(this.tree.database.getTrees());
    },

    setEditedTree(tree) {
      this.editedTree = tree;
    },

    setLabel(tree, label) {
      tree.label = label;

      if (tree.id === this.tree.id) {
        this.tree.label = label;
      } else {
        this.tree.database.updateTree(tree.id, { label });
      }
    },

    reset() {
      this.trees = [];
      this.editedTree = null;
    },

    createTree() {
      const newTree = new Tree().serialize();
      this.tree.database.createTree(newTree);
      this.tree.deserialize(newTree);
      this.tree.renderer.render();

      this.updateTrees();
    },

    setTree(tree) {
      if (tree.id === this.tree.id) return;

      this.tree.database.setTree(this.tree.id, this.tree.serialize());
      this.tree.database.setLastTreeId(tree.id);

      this.tree.deserialize(tree);
      this.tree.renderer.render();

      this.$refs.modal.close();
    },

    deleteTree(tree) {
      this.tree.database.deleteTree(tree.id);
      this.updateTrees();
    },
  },
};
</script>

<style scoped>
.trees__list {
  display: flex;
  flex-direction: column;
  gap: 8px;

  max-height: 500px;
  overflow-y: auto;
}

.trees__list__item {
  display: flex;
  align-items: center;
  gap: 8px;

  cursor: pointer;
  border-radius: 4px;
  background-color: var(--color-main-foreground);
  padding: 8px;
  min-width: 300px;
  min-height: 32px;
}

.trees__list__item:hover {
  background-color: var(--color-main-foreground-hover);
}

.trees__list__item.active {
  cursor: default;
  background-color: var(--color-main-foreground-active);
}

.trees__list__item.edited {
  background-color: var(--color-main-foreground);
}

.tree__label {
  flex: 1;
  color: var(--color-main-background);
  font-weight: bold;
}

.tree__label__input {
  flex: 1;
}

.tree__actions {
  display: flex;
  gap: 8px;
}

.tree__actions--delete {
  color: red;
}

.trees__new {
  display: flex;
  align-items: center;

  margin-top: 8px;
  width: 100%;
  color: var(--color-main-text);
  text-align: left;
}

.trees__new.alone {
  justify-content: center;
  margin-top: 0;
  border-radius: 4px;
  background-color: var(--color-main-foreground);
  width: 300px;
  height: 32px;
  color: var(--color-main-background);
  font-weight: bold;
}

.trees__new.alone:hover {
  background-color: var(--color-main-foreground-hover);
}
</style>
