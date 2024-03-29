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
        @click="setTree(treeItem)">
        <div
          v-if="editedTree !== treeItem"
          class="tree__label"
          v-text="treeItem.label"></div>
        <BaseInput
          v-if="editedTree === treeItem"
          autofocus
          class="tree__label__input"
          :value="treeItem.label"
          @input="setLabel(treeItem, $event)"
          @enter="setEditedTree(null)" />

        <div class="tree__actions">
          <BaseButton
            class="tree__action"
            @click.stop="
              setEditedTree(editedTree === treeItem ? null : treeItem)
            ">
            <BaseIcon :icon="editedTree === treeItem ? 'check' : 'pencil'" />
          </BaseButton>

          <BaseButton class="tree__action" @click.stop="deleteTree(treeItem)">
            <BaseIcon icon="trash" intent="danger" />
          </BaseButton>
        </div>
      </div>

      <BaseButton
        class="trees__new"
        :intent="trees.length === 0 ? 'primary' : 'secondary'"
        @click="createTree">
        <BaseIcon icon="plus" />
        Create new tree
      </BaseButton>
    </div>
  </BaseModal>
</template>

<script>
import { Tree } from '../../../tree'

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
    }
  },

  created() {
    this.tree.actions.addActions({
      id: 'open-trees-modal',
      toolbarGroupId: 'right',
      toolbarOrder: 1.5,
      label: 'Other trees',
      icon: 'save',
      run: () => {
        this.fetchTrees()
        this.$refs.modal.open()
      },
    })
  },

  methods: {
    fetchTrees() {
      this.trees = Object.values(this.tree.repo.readAll())
    },

    setEditedTree(tree) {
      this.editedTree = tree
    },

    setLabel(tree, label) {
      tree.label = label

      if (tree.id !== this.tree.id) {
        this.tree.repo.update(tree.id, tree)
      } else {
        this.tree.label = label
      }

      this.fetchTrees()
    },

    createTree() {
      const newTree = new Tree(this.tree.mindmap).serialize()
      this.tree.repo.create(newTree.id, newTree)
      this.tree.repo.setLastId(newTree.id)

      this.tree.deserialize(newTree)
      this.tree.renderer.render()

      this.fetchTrees()
    },

    setTree(tree) {
      if (tree.id === this.tree.id) return

      this.editedTree = null

      this.tree.repo.update(this.tree.id, this.tree.serialize())

      this.tree.repo.setLastId(tree.id)
      this.tree.deserialize(tree)
      this.tree.renderer.render()

      this.fetchTrees()
    },

    deleteTree(tree) {
      this.tree.repo.delete(tree.id)

      this.fetchTrees()

      if (tree.id === this.tree.id) {
        this.fixActiveTree()
      }
    },

    fixActiveTree() {
      const lastTree = this.trees.at(-1)
      if (!lastTree) {
        this.tree.deserialize(new Tree(this.tree.mindmap).serialize())
        this.tree.renderer.render()
        return
      }

      this.tree.repo.setLastId(lastTree.id)

      this.tree.deserialize(lastTree)
      this.tree.renderer.render()
    },

    reset() {
      this.editedTree = null
    },
  },
}
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
  background-color: var(--color-dialog-foreground);
  padding: 8px;
  min-width: 300px;
  min-height: 32px;
}

.trees__list__item:hover {
  background-color: var(--color-dialog-foreground-active);
}

.trees__list__item.active {
  cursor: default;
  background-color: var(--color-dialog-foreground-active);
}

.trees__list__item.active .tree__label,
.trees__list__item:hover .tree__label {
  color: var(--color-dialog-text-active);
}

.trees__list__item.edited {
  background-color: var(--color-dialog-foreground-active);
}

.tree__label {
  flex: 1;
  color: var(--color-dialog-text);
  font-weight: bold;
}

.tree__label__input {
  flex: 1;
}

.tree__actions {
  display: flex;
  gap: 8px;
}

.tree__action {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-dialog-foreground);
  padding: 0;
  width: 32px;
  height: 32px;
  color: var(--color-dialog-text);
}

.trees__new:only-child {
  width: 300px;
  height: 32px;
  font-weight: bold;
}
</style>
