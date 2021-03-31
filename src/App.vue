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
:root {
  --body-bg-clr: #282c34;
  --inputs-bg-clr: #353b45;
  --inputs-bg-secondary-clr: #282c34;
  --sidebar-bg-clr: #282c34;
  --context-menu-bg-clr: #353b45;
  --context-menu-item-hover-clr: #2c313a;
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
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
