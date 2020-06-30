<template> 
   <div id="cesiumContainer"></div>  
</template>

<script>
import "../../node_modules/cesium/Build/Cesium/Widgets/Widgets.css";
export default {
  name: "HelloWorld",
  data() {
    return {
      viewer: ""
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.viewer = new Cesium.Viewer("cesiumContainer", {});
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
