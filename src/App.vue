<template>
  <div id="app">
    <Tree />
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
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app > svg {
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
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

.point.chart_act_0 {
  color: #9cc;
}
.point.chart_act_1 {
  color: #fac;
}
</style>
