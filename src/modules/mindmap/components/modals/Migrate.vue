<template>
  <BaseModal ref="modal">
    <div class="migrate">
      <p>You have saved data that needs to be migrated to the new format.</p>
      <p>This is a one-time operation and should only take a few seconds.</p>

      <BaseButton @click="migrate"> Migrate </BaseButton>
    </div>
  </BaseModal>
</template>

<script>
import { MigrationManager } from '../../types/migration-manager'
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
      migrationManager: new MigrationManager(this.tree.mindmap),
    }
  },

  mounted() {
    this.tree.actions.addAction({
      id: 'migrate',
      toolbarGroupId: 'right',
      toolbarOrder: -1,
      label: 'Migrate',
      icon: 'chevrons-up',
      hotkeys: ['ctrl+m'],
      when: () => this.migrationManager.isMigrationNeeded(),
      run: () => {
        this.$refs.modal.open()
      },
    })

    this.maybePrompt()
  },

  methods: {
    maybePrompt() {
      if (!this.migrationManager.isMigrationNeeded()) return

      this.$refs.modal.open()
    },

    migrate() {
      this.migrationManager.migrate()
      this.$refs.modal.close()
    },
  },
}
</script>

<style scoped>
.migrate {
  text-align: center;
}

.migrate p:first-of-type {
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 18px;
}

.migrate p:last-of-type {
  margin-bottom: 20px;
  font-size: 16px;
}

.migrate button {
  float: right;
}
</style>
