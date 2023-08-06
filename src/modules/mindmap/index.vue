<template>
  <div class="mindmap">
    <TreesModal v-bind="{ tree }" />
    <TransferModal v-bind="{ tree }" />
    <HotkeysModal v-bind="{ tree }" />
    <MigrateModal v-bind="{ tree }" />

    <Toolbar v-bind="{ tree }" />
    <EmojiBar v-bind="{ tree }" />

    <Notebook v-bind="{ notebook }" />

    <Canvas :canvas="canvas">
      <TreeR v-bind="{ tree }" />
    </Canvas>

    <StatusBar v-bind="{ mindmap }" />
  </div>
</template>

<script>
import { Mindmap } from '../mindmap/types/mindmap'
import { LocalStorage } from '../../core/types/database/localstorage'
import actions from '../../core/actions'

import TreesModal from './components/modals/Trees.vue'
import TransferModal from './components/modals/Transfer.vue'
import HotkeysModal from './components/modals/Hotkeys.vue'
import MigrateModal from './components/modals/Migrate.vue'

import Toolbar from './components/Toolbar.r.vue'
import EmojiBar from './components/EmojiBar.r.vue'

import Canvas from './components/Canvas.vue'
import Notebook from '../../modules/notebook/index.vue'
import TreeR from '../../modules/tree/index.vue'

import StatusBar from './components/StatusBar.vue'

export default {
  components: {
    TreesModal,
    TransferModal,
    HotkeysModal,
    MigrateModal,

    Toolbar,
    EmojiBar,

    Canvas,
    Notebook,
    TreeR,

    StatusBar,
  },

  data() {
    return {
      mindmap: null,
    }
  },

  computed: {
    canvas() {
      return this.mindmap.canvas
    },

    tree() {
      return this.mindmap.tree
    },

    notebook() {
      return this.mindmap.notebook
    },
  },

  created() {
    this.mindmap = new Mindmap()

    const { tree } = this.mindmap
    tree.setDatabase(new LocalStorage())

    const lastTree = tree.database.getLastTreeId()
    if (lastTree) {
      tree.deserialize(tree.database.getTree(lastTree))
    }

    window.addEventListener('beforeunload', () => {
      tree.database.setTree(tree.id, tree.serialize())
      tree.database.setLastTreeId(tree.id)
    })

    this.mindmap.actions.addActions(...actions)
    tree.renderer.render()
  },
}
</script>

<style scoped>
.mindmap {
  position: relative;

  background-color: var(--color-main-background);
  width: 100%;
  height: 100%;
}
</style>
