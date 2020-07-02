<template> 
<div>
   <div id="cesiumContainer"></div>   
   <leftnav></leftnav>
</div>
</template>

<script>
import "../../node_modules/cesium/Build/Cesium/Widgets/Widgets.css";
import leftnav from "@/components/LeftNav";
export default {
  name: "Map3D",
  components: {
    leftnav
  },
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
      this.viewer = new Cesium.Viewer("cesiumContainer", {
        animation: false,
        fullscreenButton: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: true,
        timeline: false,
        navigationHelpButton: false,
        navigation: true,
        navigationInstructionsInitiallyVisible: false,
        selectionIndicator: false,
        geocoder: false,
        baseLayerPicker: false
      });
      var tileset = this.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url:'http://localhost:9000/model/272520009b4311eaa2c80746eb775c79/tileset.json',
        maximumScreenSpaceError:2 //最大屏幕误差，测试下这玩意有什么用
      }))
      this.viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(113.91, 22.52, 18000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-90),
          roll: Cesium.Math.toRadians(0)
        }
      });
      this.viewer._cesiumWidget._creditContainer.style.display = "none";
      this.$Helpers.viewer = this.viewer;
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
