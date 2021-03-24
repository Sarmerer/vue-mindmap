<template>
  <div id="app" @tab.prevent>
    <Tree />
  </div>
</template>

<script>
import Tree from "./components/Tree";

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

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

.point.chart_act_0 {
  color: #9cc;
}
.point.chart_act_1 {
  color: #fac;
}
</style>
