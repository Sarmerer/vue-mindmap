<template>
  <div id="app">
    <Mindmap />
  </div>
</template>

<script>
import Mindmap from './modules/mindmap/index.vue'

export default {
  name: 'App',

  components: { Mindmap },
}
</script>

<style>
body.theme-light {
  --layer-base: 0;
  --layer-overlay: 1;
  --layer-modal: 2;
  --layer-top: 3;

  --color-accent-background: #a03bc3;
  --color-accent-foreground: #fff;

  --color-danger-background: #e74c3c;
  --color-danger-foreground: #fff;

  --color-warning-background: #f1c40f;
  --color-warning-foreground: #fff;

  --color-success-background: #2ecc71;
  --color-success-foreground: #fff;

  --color-info-background: #3498db;
  --color-info-foreground: #fff;

  --color-text: #333;

  --color-toolbar-background: #fff;
  --color-toolbar-foreground: #fff;
  --color-toolbar-border: var(--color-accent-background);
  --color-toolbar-text: var(--color-text);
  --color-toolbar-text-active: #fff;
  --color-toolbar-foreground-active: var(--color-accent-background);

  --color-main-background: #fff;
  --color-main-foreground: #e0e0e0;

  --color-statusbar-background: white;
  --color-statusbar-foreground: #ecf0f1;
  --color-statusbar-hover: #bdc3c7;
  --color-statusbar-active: #95a5a6;
  --color-statusbar-separator: #e5e5e5;
  --color-statusbar-text: var(--color-text);

  --color-input-background: #fff;
  --color-input-border: #e0e0e0;
  --color-input-text: var(--color-text);
  --color-input-background-focus: #fff;
  --color-input-border-focus: var(--color-accent-background);

  --color-button-background: #333;
  --color-button-foreground: #fff;
  --color-button-background-secondary: #fff;
  --color-button-foreground-secondary: #333;

  --color-dialog-background: #fff;
  --color-dialog-foreground: #ededed;
  --color-dialog-border: #e0e0e0;
  --color-dialog-text: var(--color-text);
  --color-dialog-foreground-active: var(--color-accent-background);
  --color-dialog-text-active: #fff;

  --color-contextmenu-background: #fff;
  --color-contextmenu-foreground: #333;
  --color-contextmenu-border: #e0e0e0;
  --color-contextmenu-text: var(--color-text);
  --color-contextmenu-foreground-active: var(--color-accent-background);
  --color-contextmenu-text-active: #fff;

  --color-tree-node-background: #282c34;
  --color-tree-node-text: var(--color-text);
  --color-tree-node-background-active: rgba(128, 128, 128, 0.3);

  --color-tree-line-background: #000;

  --color-notebook-note-background: #fff;
  --color-notebook-note-border: #ccc;
  --color-notebook-note-text: var(--color-text);
  --color-notebook-note-background-active: #dcdcdc;
  --color-notebook-note-border-active: #ccc;

  --color-notebook-group-background: transparent;
  --color-notebook-group-border: #ddd;
  --color-notebook-group-handle: #ccc;
  --color-notebook-group-background-active: rgba(128, 128, 128, 0.15);
  --color-notebook-group-border-active: rgba(128, 128, 128, 0.15);
  --color-notebook-group-handle-active: #aaa;

  --color-notebook-shadow-border: #aaa;
}

body.theme-dark {
  --color-accent-background: #5c6370;
  --color-accent-foreground: #fff;

  --color-danger-background: #9b2915;
  --color-danger-foreground: #fff;

  --color-warning-background: #c99b0b;
  --color-warning-foreground: #fff;

  --color-success-background: #1e8649;
  --color-success-foreground: #fff;

  --color-info-background: #1e6d99;
  --color-info-foreground: #fff;

  --color-text: #ddd;

  --color-toolbar-background: #262626;
  --color-toolbar-foreground: #262626;
  --color-toolbar-border: var(--color-accent-background);
  --color-toolbar-text: var(--color-text);
  --color-toolbar-text-active: #fff;
  --color-toolbar-foreground-active: var(--color-accent-background);

  --color-main-background: #262626;
  --color-main-foreground: #4d4d4d;

  --color-statusbar-background: #262626;
  --color-statusbar-foreground: #4d4d4d;
  --color-statusbar-hover: #353535;
  --color-statusbar-active: #4d4d4d;
  --color-statusbar-separator: #353535;
  --color-statusbar-text: var(--color-text);

  --color-input-background: #4d4d4d;
  --color-input-border: #666;
  --color-input-text: var(--color-text);
  --color-input-background-focus: #666;
  --color-input-border-focus: var(--color-accent-background);

  --color-button-background: #333;
  --color-button-foreground: #fff;
  --color-button-background-secondary: #262626;
  --color-button-foreground-secondary: #ddd;

  --color-dialog-background: #262626;
  --color-dialog-foreground: #4d4d4d;
  --color-dialog-border: #666;
  --color-dialog-text: var(--color-text);
  --color-dialog-foreground-active: var(--color-accent-background);
  --color-dialog-text-active: #fff;

  --color-contextmenu-background: #1f1f1f;
  --color-contextmenu-foreground: #666;
  --color-contextmenu-border: #666;
  --color-contextmenu-text: var(--color-text);
  --color-contextmenu-foreground-active: var(--color-accent-background);
  --color-contextmenu-text-active: #fff;

  --color-tree-node-background: #1f1f1f;
  --color-tree-node-text: var(--color-text);
  --color-tree-node-background-active: rgba(128, 128, 128, 0.3);

  --color-tree-line-background: #666;

  --color-notebook-note-background: #262626;
  --color-notebook-note-border: #666;
  --color-notebook-note-text: var(--color-text);
  --color-notebook-note-background-active: #4d4d4d;
  --color-notebook-note-border-active: #666;

  --color-notebook-group-background: transparent;
  --color-notebook-group-border: #666;
  --color-notebook-group-handle: #666;
  --color-notebook-group-background-active: rgba(128, 128, 128, 0.15);
  --color-notebook-group-border-active: rgba(128, 128, 128, 0.15);
  --color-notebook-group-handle-active: #999;

  --color-notebook-shadow-border: #666;
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
  font-family: 'Roboto', sans-serif;
}
</style>
