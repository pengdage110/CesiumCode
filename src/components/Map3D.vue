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
    leftnav,
  },
  data() {
    return {
      viewer: "",
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.viewer = new Cesium.Viewer('cesiumContainer', {
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        infoBox: false,
        shouldAnimate: true,
        selectionIndicator: false,
        clampToGround: true,
        baseLayerPicker: false,
        requestWaterMask: true,
        requestVertexNormals: false,
        requestRenderMode: true,
        maximumRenderTimeChange: Infinity,
        imageryProvider: new Cesium.MapboxImageryProvider({
          mapId: "mapbox.satellite",
          accessToken:
            "pk.eyJ1IjoiY2l0eWJveSIsImEiOiJja2RqbXhzaW4wYTM3MndsdDB5NnFoa2IyIn0.wHL7O2CJzB8ep7SocqFTaQ",
        }),
      });
      this.viewer._cesiumWidget._creditContainer.style.display = "none";
      this.viewer.scene.globe.depthTestAgainstTerrain = true;
      this.viewer.resolutionScale = 0.9; //画面精细度
      this.viewer.scene.moon.show = false; //月亮
      this.viewer.scene.fog.enabled = false; // 雾
      this.viewer.scene.sun.show = false; // 太阳
      this.viewer.scene.skyBox.show = false; //天空盒子
      this.viewer.clock.currentTime = Cesium.JulianDate.fromDate(
        new Date(2020, 10, 1, 6, 0, 0)
      );
      // var rect;

      // this.viewer.imageryLayers.addImageryProvider(
      //   new Cesium.UrlTemplateImageryProvider({
      //     url:
      //       "http://mt1.google.cn/vt/lyrs=s,h&gl=cn&x={x}&y={y}&z={z}&s=Gali",
      //     rectangle: rect,
      //     //minimumLevel:0,
      //     //maximumLevel:undefined
      //   })
      // );
      var tileset = this.viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url:
            "http://localhost:9000/model/272520009b4311eaa2c80746eb775c79/tileset.json",
          maximumScreenSpaceError: 2, //最大屏幕误差，测试下这玩意有什么用
        })
      );
      this.viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(113.91, 22.52, 18000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-90),
          roll: Cesium.Math.toRadians(0),
        },
      });
      this.viewer._cesiumWidget._creditContainer.style.display = "none";
      this.$Helpers.viewer = this.viewer;
    },
  },
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
