<template>
  <modal
    class="helper"
    name="import-export-modal"
    :adaptive="true"
    height="auto"
    width="30%"
    @before-open="beforeOpen"
  >
    <import-JSON v-if="currTab === 'import'"></import-JSON>
    <export-JSON v-else></export-JSON>
  </modal>
</template>
<script>
import ImportJSON from "@/components/ImportJSON";
import ExportJSON from "@/components/ExportJSON";

export default {
  name: "ImportExport",
  components: {
    ImportJSON,
    ExportJSON,
  },
  data() {
    return {
      currTab: "",
    };
  },
  methods: {
    beforeOpen(e) {
      this.currTab = e.params;
    },
  },
};
</script>
<style lang="scss" scoped>
.helper {
  user-select: none;
}

::v-deep .checkbox {
  width: fit-content;
  border: 2px solid var(--primary-clr);
  padding: 0.2rem;
  border-radius: 0.2rem;

  .checkbox-label {
    margin: 0 0.2rem 0 0;
  }

  &.checked {
    border: 2px solid var(--secondary-clr);
    background-color: var(--primary-clr);
  }

  input[type="checkbox"] {
    -webkit-appearance: none;
    outline: none;
    // &:checked::before {
    //   content: "\2713";
    //   color: rgba(32, 32, 32, 0.857);
    // }
    // &::before {
    //   content: "\2715";
    //   color: rgba(32, 32, 32, 0.857);
    // }
  }
}
</style>
