<template>
  <dialog
    ref="dialog"
    class="modal"
    @close="$emit('close')"
    @click="maybeClose">
    <div class="modal__content" @click.stop>
      <slot></slot>
    </div>
  </dialog>
</template>

<script>
export default {
  methods: {
    open() {
      this.$refs.dialog.showModal()
    },

    close() {
      this.$refs.dialog.close()
    },

    maybeClose(event) {
      if (event.target === this.$refs.dialog) {
        this.close()
      }
    },
  },
}
</script>

<style scoped>
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;

  z-index: var(--layer-modal);
  inset: 0;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
  border: none;
  border-radius: 4px;
  background-color: var(--color-dialog-background);
  padding: 0;
  width: fit-content;
  height: fit-content;
  color: var(--color-dialog-text);
}

.modal[open] {
  display: block;
}

.modal::backdrop {
  background-color: rgba(0, 0, 0, 0.3);
}

.modal__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 16px;
}
</style>
