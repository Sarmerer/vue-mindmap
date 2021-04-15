<template>
  <div id="app">
    <tree></tree>
  </div>
</template>

<script>
import Tree from "@/components/Tree";

export default {
  name: "App",
  components: {
    Tree,
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");

:root {
  --body-bg-clr: #eef2f5;
  --primary-clr: #eef2f5;
  --secondary-clr: #a03bc3;
  --node-bg-clr: white;
  --node-link-clr: #a03bc3;
  --node-bg-secondary-clr: #282c34;
  --context-menu-bg-clr: #293845;
  --context-menu-item-hover-clr: #a03bc3;
  --hr-clr: #6e6b74;
  --max-height: calc(100vh - 1.5rem);
  --text-primary: rgba(255, 255, 255, 0.6);
  --text-secondary: rgba(255, 255, 255, 0.87);

  --font-family: "Roboto", sans-serif;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: var(--body-bg-clr);
}

#app {
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>
