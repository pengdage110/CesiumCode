<template>
  <div>
    <div id="cesiumContainer"></div>
    <leftnav></leftnav>
    <rightnav></rightnav>
  </div>
</template>

<script>
import leftnav from "@/components/LeftNav";
import rightnav from "@/components/RightNav";
require('@dvgis/cesium-map')
export default {
  name: "Map3D",
  components: {
    leftnav,
    rightnav,
  },
  data() {
    return {
      viewer: "",
    };
  },
  mounted() {
    this.init();
    this.loadAroundBox();
  },
  methods: {
    init() {
      this.viewer = new Cesium.Viewer("cesiumContainer", {
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
        shouldAnimate: false,
        selectionIndicator: false,
        clampToGround: true,
        baseLayerPicker: false,
        requestWaterMask: true,
        requestVertexNormals: false,
        requestRenderMode: true,
        maximumRenderTimeChange: Infinity,
        // imageryProvider: new Cesium.MapboxImageryProvider({
        //   mapId: "mapbox.satellite",
        //   accessToken:
        //     "pk.eyJ1IjoiY2l0eWJveSIsImEiOiJja2RqbXhzaW4wYTM3MndsdDB5NnFoa2IyIn0.wHL7O2CJzB8ep7SocqFTaQ",
        // }),
        // imageryProvider: new Cesium.UrlTemplateImageryProvider({
        //   url:
        //     "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
        // }),
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
          url:
            "http://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        }),
      });
      //是否开启抗锯齿
      this.viewer.scene.fxaa = true;
      this.viewer.scene.postProcessStages.fxaa.enabled = true;
      this.viewer._cesiumWidget._creditContainer.style.display = "none";
      this.viewer.scene.globe.depthTestAgainstTerrain = true;
      this.viewer.resolutionScale = 0.9; //画面精细度
      this.viewer.scene.moon.show = false; //月亮
      this.viewer.scene.fog.enabled = false; // 雾
      this.viewer.scene.sun.show = false; // 太阳
      this.viewer.scene.skyBox.show = false; //天空盒子
      // this.viewer.clock.currentTime = Cesium.JulianDate.fromDate(
      //   new Date(2020, 10, 1, 6, 0, 0)
      // );

      //测试百度地图偏移加载
      let options = {
        style: "midnight", // style: img、vec、normal、dark
        crs: "WGS84", // 使用84坐标系，默认为：BD09
      };
      this.viewer.imageryLayers.addImageryProvider(
        new Cesium.BaiduImageryProvider(options)
      );


      var tileset = this.viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url:
            "http://localhost:9000/model/41311680be9611ebb042d53f49f54e21/tileset.json",
          //'http://www.icloud5d.com:9994/3d/tileset.json',
          //modelMatrix: Cesium.Matrix4.fromArray([0.9999999999999993,2.4980018054066022e-15,3.9029537324264396e-8,0,2.1649348980190553e-15,0.9999999999999909,-1.366572049410486e-7,0,-3.902953703283085e-8,1.3665720544064897e-7,0.99999999999999,0,75.51455586240627,-264.4050879208371,-153.66996458591893,1]),
          maximumScreenSpaceError: 2, //最大屏幕误差，测试下这玩意有什么用
        })
      );
      this.viewer.flyTo(tileset);
      // this.viewer.scene.primitives.add(
      //   new Cesium.Cesium3DTileset({
      //     url:
      //       "http://localhost:9000/model/cec1ab1080a511eba75b07b5bf9efb90/tileset.json",
      //     //'http://www.icloud5d.com:9994/model/tileset.json',
      //     //modelMatrix: Cesium.Matrix4.fromArray([0.9999999999999993,2.4980018054066022e-15,3.9029537324264396e-8,0,2.1649348980190553e-15,0.9999999999999909,-1.366572049410486e-7,0,-3.902953703283085e-8,1.3665720544064897e-7,0.99999999999999,0,75.51455586240627,-264.4050879208371,-153.66996458591893,1]),
      //     maximumScreenSpaceError: 2, //最大屏幕误差，测试下这玩意有什么用
      //   })
      // );
      // this.viewer.camera.setView({
      //   destination: Cesium.Cartesian3.fromDegrees(113.91, 22.52, 18000),
      //   orientation: {
      //     heading: Cesium.Math.toRadians(0),
      //     pitch: Cesium.Math.toRadians(-90),
      //     roll: Cesium.Math.toRadians(0),
      //   },
      // });

      // this.viewer.scene.camera.setView({
      //   destination: {
      //     x: -2264713.773444937,
      //     y: 4437097.6365463445,
      //     z: 4052169.8549779626,
      //   },
      //   orientation: {
      //     heading: 5.625615618387119,
      //     pitch: -0.5513619022102629,
      //     roll: 0.00001297575603054213,
      //   },
      // });
      this.viewer._cesiumWidget._creditContainer.style.display = "none";
      this.viewer.scene.highDynamicRange = false; //特别提示：当互联网底图比较暗时可尝试用这句优化，此处测试对卫星影像图好像没有作用
      this.$Helpers.viewer = this.viewer;

      //callbackProperty测试
      // let startLatitude = 32,
      // startLongitude = 120;
      // let endLongitude;
      // let startTime = Cesium.JulianDate.now();
      // let isConstant = false;
      // let redLine = this.viewer.entities.add({
      //   polyline:{
      //     positions:new Cesium.CallbackProperty(function(time,result){
      //       endLongitude = startLongitude+0.001*Cesium.JulianDate.secondsDifference(time,startTime);
      //       return Cesium.Cartesian3.fromDegreesArray([startLongitude,startLatitude,endLongitude,startLatitude],Cesium.Ellipsoid.WGS84,result);
      //     },isConstant),
      //     width:5,
      //     material:Cesium.Color.RED
      //   }
      // });

      // let startCartographic = Cesium.Cartographic.fromDegrees(
      //   startLongitude,
      //   startLatitude
      // );
      // let endCartographic = new Cesium.Cartographic();
      // let scratch = new Cesium.Cartographic();
      // let geodesic = new Cesium.EllipsoidGeodesic();//大概就是一条贴椭球地面的线，用经纬度弧度创建,可获取贴地长度

      // function getLength(time,result){
      //   let endPoint = redLine.polyline.positions.getValue(time,result)[1];
      //   endCartographic = Cesium.Cartographic.fromCartesian(endPoint);
      //   geodesic.setEndPoints(startCartographic,endCartographic);
      //   let lengthInMeters = Math.round(geodesic.surfaceDistance);
      //   return (lengthInMeters/1000).toFixed(1)+'km';
      // }

      // function getMidpoint(time,result){
      //   let endPoint = redLine.polyline.positions.getValue(time,result)[1];
      //   endCartographic = Cesium.Cartographic.fromCartesian(endPoint);
      //   geodesic.setEndPoints(startCartographic,endCartographic);
      //   let modpointCartographic = geodesic.interpolateUsingFraction(0.5,scratch);//获取贴地线指定位置的坐标
      //   return Cesium.Cartesian3.fromRadians(modpointCartographic.longitude,modpointCartographic.latitude);
      // }

      // let label = this.viewer.entities.add({
      //   position:new Cesium.CallbackProperty(getMidpoint,isConstant),
      //   label:{
      //     text:new Cesium.CallbackProperty(getLength,isConstant),
      //     font:"20px sans-serif",
      //     pixelOffset:new Cesium.Cartesian2(0.0,20)
      //   }
      // })

      //this.viewer.trackedEntity = label;
    },
     //加载周边白膜数据
    loadAroundBox() {
        let tileset = this.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({           
            url: "http://localhost:9000/model/cd8755e0b94611eba646d131ed2b2fa0/tileset.json"
        }));
        tileset.readyPromise.then((tileset) => {
            // this.setTilesetHeight(tileset);
            tileset.tileVisible.addEventListener(function (tile) {
                var content = tile.content;
                var featuresLength = content.featuresLength;
                for (var i = 0; i < featuresLength; i += 2) {
                    let feature = content.getFeature(i)
                    let model = feature.content._model

                    if (model && model._sourcePrograms && model._rendererResources) {
                        Object.keys(model._sourcePrograms).forEach(key => {
                            let program = model._sourcePrograms[key]
                            model._rendererResources.sourceShaders[program.fragmentShader] =
                                `varying vec3 v_positionEC;
                              void main(void){
                                  vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
                                  float glowRange = 100.0; // 光环的移动范围(高度)
                                  gl_FragColor = vec4(0.2,  0.5, 1.0, 1.0); // 颜色
                                  gl_FragColor *= vec4(vec3(position.z / 100.0), 1.0); // 渐变
                                  // 动态光环
                                  float time = fract(czm_frameNumber / 360.0);
                                  time = abs(time - 0.5) * 2.0;
                                  float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));
                                  gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);
                              }
                             `
                        })
                        model._shouldRegenerateShaders = true
                    }
                }
            });
        }).otherwise(function (error) {
            console.error(error);
        });
    }
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
