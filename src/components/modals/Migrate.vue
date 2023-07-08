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
import { MigrationManager } from "../../types/migration-manager";
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
      migrationManager: new MigrationManager(),
    };
  },

  mounted() {
    this.tree.actionsManager.addAction({
      id: "migrate",
      toolbarGroupId: "right",
      toolbarOrder: 6,
      label: "Migrate",
      icon: "chevrons-up",
      when: () => this.migrationManager.isMigrationNeeded(),
      run: () => {
        this.$refs.modal.open();
      },
    });

    if (!this.migrationManager.isMigrationNeeded()) return;

    this.$refs.modal.open();
  },

  methods: {
    migrate() {
      this.migrationManager.migrate();
      this.$refs.modal.close();
    },
  },
};
</script>

<style scoped>
.migrate {
  text-align: center;
}

.migrate p:first-of-type {
  margin-bottom: 10px;
  color: var(--color-main-text);
  font-weight: bold;
  font-size: 18px;
}

.migrate p:last-of-type {
  margin-bottom: 20px;
  color: var(--color-main-text);
  font-size: 16px;
}

.migrate button {
  float: right;
  transition: background-color 0.3s;
  margin-top: 8px;

  border-radius: 4px;
  background-color: var(--color-main-foreground);
  padding: 10px 20px;
  color: var(--color-main-background);
  font-size: 16px;
}

.migrate button:hover {
  background-color: var(--color-main-foreground-hover);
}
</style>
