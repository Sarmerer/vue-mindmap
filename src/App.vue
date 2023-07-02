<template>
  <div id="app">
    <Mindmap />
  </div>
</template>

<script>
import Mindmap from "./components/Mindmap.vue";

export default {
  name: "App",

  components: {
    Mindmap,
  },
};
</script>

<style>
:root {
  --color-toolbar-background: white;
  --color-toolbar-foreground: white;
  --color-toolbar-foreground-hover: #a03bc3;
  --color-toolbar-foreground-active: #a03bc3;
  --color-toolbar-separator: #e5e5e5;
  --color-toolbar-text: #2c3e50;

  --color-main-background: white;
  --color-main-foreground: #2c3e50;
  --color-main-foreground-hover: #bdc3c7;
  --color-main-foreground-active: #95a5a6;
  --color-main-text: #2c3e50;

  --color-statusbar-background: white;
  --color-statusbar-foreground: #ecf0f1;
  --color-statusbar-foreground-hover: #bdc3c7;
  --color-statusbar-foreground-active: #95a5a6;
  --color-statusbar-separator: #e5e5e5;
  --color-statusbar-text: #2c3e50;

  --layer-base: 0;
  --layer-overlay: 1;
  --layer-modal: 2;
  --layer-top: 3;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-toolbar-background: #282c34;
    --color-toolbar-foreground: #282c34;
    --color-toolbar-foreground-hover: #5c6370;
    --color-toolbar-foreground-active: #5c6370;
    --color-toolbar-separator: #5c6370;
    --color-toolbar-text: #abb2bf;

    --color-main-background: #282c34;
    --color-main-foreground: #bbc2cf;
    --color-main-foreground-hover: #5c6370;
    --color-main-foreground-active: #5c6370;
    --color-main-text: #abb2bf;

    --color-statusbar-background: #282c34;
    --color-statusbar-foreground: #abb2bf;
    --color-statusbar-foreground-hover: #353941;
    --color-statusbar-foreground-active: #5c6370;
    --color-statusbar-separator: #5c6370;
    --color-statusbar-text: #abb2bf;
  }
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
}
</style>
