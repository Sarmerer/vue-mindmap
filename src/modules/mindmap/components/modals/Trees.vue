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
            class="tree__actions--edit"
            @click.stop="
              setEditedTree(editedTree === treeItem ? null : treeItem)
            ">
            <BaseIcon :icon="editedTree === treeItem ? 'check' : 'pencil'" />
          </BaseButton>

          <BaseButton
            class="tree__actions--delete"
            @click.stop="deleteTree(treeItem)">
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
      @click="createTree">
      <BaseIcon icon="plus" />
      Create new tree
    </BaseButton>
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
  color: var(--color-main-background);
  text-align: left;
}

.trees__new.alone {
  justify-content: center;
  margin-top: 0;
  border-radius: 4px;
  background-color: var(--color-main-foreground);
  width: 300px;
  height: 32px;
  font-weight: bold;
}

.trees__new.alone:hover {
  background-color: var(--color-main-foreground-hover);
}
</style>
