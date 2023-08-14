<template>
  <div class="mindmap">
    <TreesModal v-bind="{ tree }" />
    <TransferModal v-bind="{ tree }" />
    <HotkeysModal v-bind="{ tree }" />
    <MigrateModal v-bind="{ tree }" />
    <SettingsModal v-bind="{ tree }" />

    <Toolbar v-bind="{ tree }" />

    <div class="mindmap__content">
      <EmojiBar v-bind="{ mindmap }" />

      <Notebook v-bind="{ notebook }" />

      <Canvas :canvas="canvas" @mousedown.native="clearActiveElement">
        <TreeR v-bind="{ tree }" />
      </Canvas>
    </div>

    <StatusBar v-bind="{ mindmap }" />
  </div>
</template>

<script>
import { Mindmap } from '../mindmap/types/mindmap'
import actions from '../../core/actions'
import settings from '../../core/settings'

import TreesModal from './components/modals/Trees.vue'
import TransferModal from './components/modals/Transfer.vue'
import HotkeysModal from './components/modals/Hotkeys.vue'
import MigrateModal from './components/modals/Migrate.vue'
import SettingsModal from './components/modals/Settings/index.vue'

import Toolbar from './components/Toolbar.r.vue'
import EmojiBar from '../emoji'

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
    SettingsModal,

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
    this.mindmap.actions.addActions(...actions)
    this.mindmap.settings.addSettings(...settings)
    this.mindmap.repo.init()
  },

  methods: {
    clearActiveElement() {
      this.mindmap.setActiveElement(null)
    },
  },
}
</script>

<style scoped>
.mindmap {
  display: flex;
  position: relative;
  flex-direction: column;

  background-color: var(--color-main-background);
  width: 100%;
  height: 100%;
}

.mindmap__content {
  position: relative;
  flex: 1 1 auto;
  overflow: hidden;
}
</style>
