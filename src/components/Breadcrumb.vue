<template>
  <div class="breadcrumb">
    <span>
      <span v-for="(q, index) in query" :key="index">
        <a href="#" @click="popStack(index)">{{ q }}</a>
        <svg
          v-if="index + 1 < queryLen"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-chevron-right"
          viewBox="0 -4 16 18"
        >
          <path
            fill-rule="evenodd"
            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </span>
    </span>
  </div>
</template>
<script>
import { tree } from "@/tree";

export default {
  name: "Breadcrumb",
  computed: {
    query() {
      return tree.query.map((q) => q.name);
    },
    queryLen() {
      return tree.query.length;
    },
  },
  methods: {
    popStack(amount) {
      tree.spliceRootsQuery(tree.query.length - amount);
    },
  },
};
</script>
<style lang="scss">
.breadcrumb {
  position: absolute;
  top: 1rem;
  left: 1rem;
  user-select: none;
  z-index: 10;
}
</style>
