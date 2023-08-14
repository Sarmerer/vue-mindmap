<template>
  <BaseModal ref="modal">
    <div class="settings">
      <h2 class="settings__title">Settings</h2>

      <Setting v-for="setting of settings" v-bind="{ setting }" />
    </div>
  </BaseModal>
</template>

<script>
import { Tree } from '../../../../tree'

import Setting from './Setting.vue'

export default {
  props: {
    tree: {
      type: Tree,
      required: true,
    },
  },

  components: {
    Setting,
  },

  computed: {
    settings() {
      return this.tree.mindmap.settings.settings
    },
  },

  mounted() {
    this.tree.actions.addAction({
      id: 'settings',
      toolbarGroupId: 'right',
      toolbarOrder: 4,
      label: 'Settings',
      icon: 'cog',
      hotkeys: ['ctrl+,'],
      run: () => this.$refs.modal.open(),
    })
  },
}
</script>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  min-width: 250px;
}

.settings__title {
  margin: 0 0 15px 0;
  font-weight: bold;
  font-size: 20px;
}
</style>
