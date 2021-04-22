<template>
  <div class="breadcrumb">
    <span>
      <span v-for="(q, index) in query" :key="index">
        <a href="#" @click="popStack(index)">{{ q }}</a>
        <b-icon
          v-if="index + 1 < queryLen"
          icon="chevron-right"
          shift-v="-2"
          shift-h="1"
        ></b-icon>
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
  bottom: 1rem;
  left: 1rem;
  user-select: none;
  z-index: 10;
}
</style>
