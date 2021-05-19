<template>
  <div class="videoOverlay">
    <div class="panel-header">视频融合</div>
    <div class="panel-body">
      <el-form
        ref="form"
        :model="form"
        label-width="60px"
        label-position="lefe"
        size="mini"
      >
        <el-form-item label="翻转">
          <el-slider
            v-model="form.rotation.x"
            :show-tooltip="true"
            @input="valueChange"
            :min="-180"
            :max="180"
          >
          </el-slider>
        </el-form-item>
        <el-form-item label="旋转">
          <el-slider
            v-model="form.rotation.y"
            :show-tooltip="true"
            @input="valueChange"
            :min="-360"
            :max="360"
          ></el-slider>
        </el-form-item>
         <el-form-item label="夹角">
            <el-slider
              v-model="form.fov"
              :show-tooltip="true"
              @input="valueChange"
              :min="0"
              :max="90"
            ></el-slider>
          </el-form-item>
         <el-form-item label="透明">
            <el-slider
              v-model="form.alpha"
              :show-tooltip="true"
              @input="valueChange"
              :step="0.1"
              :min="0"
              :max="1"
            ></el-slider>
          </el-form-item>
        <el-form-item label="投影线">
          <el-switch
            v-model="form.debugFrustum"
            @change="setFrustumVisible"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
      </el-form>
      <video
        src="/static/lukou.mp4"
        autoplay="autoplay"
        id="testVideo"
        controls
        style="height: 200px; width: 369px"
      ></video>
    </div>
  </div>
</template>

<script>
import VideoShed3d from "../map3d/VideoShed3d";
export default {
  name: "videoOverlay",
  data() {
    return {
      form: {
        rotation: {},
      },
      videoShed3d: null,
      viewer: null,
    };
  },

  mounted() {
    this.viewer = this.$Helpers.viewer;
    //this.setView();
    this.initVideoFuse();
    this.form = this.videoShed3d.getOptions();
  },
  beforeDestroy() {
    this.viewer.entities.removeAll();
    //this.viewer.imageryLayers.removeAll(true);
    //this.viewer.destroy();
  },

  methods: {
    initVideoFuse() {
      this.videoShed3d = new VideoShed3d(this.viewer, {
        url: "../../static/lukou.mp4",
        position: {
          x: 113.947454,
          y: 22.512816,
          z: 72.01781951233912,
        },
        //旋转参数
        rotation: {
          x: -53,
          y: 3,
          z: 0,
        },
        near: 0,
        far: 240, //距离
        fov: 12, //张角
        aspectRatio: 1,
        alpha: 1, //透明
        debugFrustum: true, //是否显示投影线
      });
    },
    //设置视角
    setView() {
      let flyToOpts = {
        destination: {
          x: -1715364.449942997,
          y: 4993248.386956065,
          z: 3566686.6600144217,
        },
        orientation: {
          heading: 6.005026929302029,
          pitch: -1.1614799523621118,
          roll: 6.281017982608725,
        },
        duration: 1,
      };
      this.viewer.scene.camera.setView(flyToOpts);
    },

    //参数调整
    valueChange(){
        this.videoShed3d.updateOptions(this.form);
    },
    setFrustumVisible(){
        this.videoShed3d.setFrustumVisible(this.form.debugFrustum);
    }
  },
};
</script>

<style   scoped>
.videoOverlay{
    position:absolute;
    top:0px;
    left:55px;
}
.panel-body /deep/ .el-form-item__label {
  color: #edeeee;
  line-height: 40px;
}
</style>