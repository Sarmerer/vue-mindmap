<template>
  <div class="notebook">
    <Group
      v-for="group in notebook.groups"
      :key="group.id"
      v-bind="{ group }"
    />

    <Note v-for="note in notebook.notes" :key="note.id" v-bind="{ note }" />
  </div>
</template>

<script>
import { Notebook } from "./types/notebook";

import Group from "./components/Group.vue";
import Note from "./components/Note.vue";

export default {
  props: {
    notebook: {
      type: Notebook,
      required: true,
    },
  },

  components: { Group, Note },
};
</script>

<style scoped>
.notebook {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
