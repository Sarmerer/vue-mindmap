<template>
  <div id="app">
    <Mindmap />
  </div>
</template>

<script>
import { tree } from "@/tree";

import Mindmap from "./components/Mindmap.vue";

export default {
  name: "App",

  components: {
    Mindmap,
  },

  data() {
    return {
      tree,
    };
  },
};
</script>

<style>
:root {
  --primary-clr: #eef2f5;
  --secondary-clr: #a03bc3;
  --node-bg-clr: white;
  --node-link-clr: black;
  --node-bg-secondary-clr: #282c34;
  --context-menu-bg-clr: #293845;
  --context-menu-item-hover-clr: #a03bc3;
  --hr-clr: #6e6b74;
  --max-height: calc(100vh - 1.5rem);
  --text-primary: rgba(255, 255, 255, 0.6);
  --text-secondary: rgba(255, 255, 255, 0.87);
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: #2c3e50;
}
</style>
