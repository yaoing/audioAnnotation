<template>
  <div id="app">
    <Annotator></Annotator>
  </div>
</template>

<script>
import Annotator from './components/Annotator.vue'

export default {
  name: 'App',
  components: {
    Annotator
  }
}
</script>

<style>
  *{
    /*user-select: none;*/
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
#app {
  width: 100vw;
  height: 100vh;
  font-family: "Microsoft YaHei UI ,Avenir, Helvetica";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;


}
</style>
