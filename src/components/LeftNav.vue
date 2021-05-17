<template>
  <div class="leftnav-box leftnav">
    <div
      class="leftnav-item"
      v-for="obj in navList"
      :key="obj.name"
      @click="switchNavName(obj.name)"
    >
      <img :src="navName == obj.name ? obj.icona : obj.icon" alt="" />
      <div>{{ obj.name }}</div>
    </div>
  </div>
</template>

<script>
import leftnavmixin from "@/minixs/LeftNavMinix";
import measureminix from "@/minixs/MeasureMinix";
import measure from "@/minixs/demo.js";
import scanFunc from "@/map3d/circleScanHelper.js";
import cesiumODLine from "@/map3d/utils/ODLine.js";
import { PrimitiveTexture } from "@/map3d/utils/voidTexture.js";
export default {
  name: "leftnav",
  mixins: [leftnavmixin, measureminix],
  data() {
    return {
      navList: [],
      navName: "",
    };
  },
  created() {
    this.setNavList();
  },
  mounted() {
    arrow.disable();
  },

  methods: {
    switchNavName(name) {
      if (this.navName === name) {
        this.navName = "";
        //取消点选功能状态
        this.UnSelect();
        if (name === "交通车流") {
          this.$Helpers.viewer.scene.primitives.removeAll();
        }
        return;
      }
      this.navName = name;
      switch (name) {
        case "距离测量":
          measure.measureLineSpace(this.$Helpers.viewer);
          break;
        case "面积测量":
          measure.measureAreaSpace(this.$Helpers.viewer);
          break;
        case "点击查询":
          arrow.disable();
          this.featureSelcet();
          break;
        case "直角箭头":
          arrow.init(this.$Helpers.viewer);
          arrow.draw("straightArrow");
          break;
        case "燕尾箭头":
          arrow.init(this.$Helpers.viewer);
          arrow.draw("attackArrow");
          break;
        case "钳击箭头":
          arrow.init(this.$Helpers.viewer);
          arrow.draw("pincerArrow");
          break;
        case "雷达扫描":
          scanFunc.setRadarScan(this.$Helpers.viewer);
          break;
        case "圆形扫描":
          scanFunc.setCircleScan(this.$Helpers.viewer);
          break;
        case "双环扫描":
          scanFunc.setDoubleCircleRipple(this.$Helpers.viewer);
          break;
        case "全球自转":
          this.autoRotate(true, 5000000);
          break;
        case "交通车流":
          cesiumODLine.loadLinesData(this.$Helpers.viewer);
          break;
        case "视频投影":
          this.setVoidTexture();
          break;
      }
    },
    setNavList() {
      this.navList = [
        {
          name: "距离测量",
          icon: "static/images/width-test-icon.svg",
          icona: "static/images/width-test-icon-a.svg",
        },
        {
          name: "面积测量",
          icon: "static/images/acreage-test-icon.svg",
          icona: "static/images/acreage-test-icon-a.svg",
        },
        {
          name: "点击查询",
          icon: "static/images/select1.png",
          icona: "static/images/select2.png",
        },
        {
          name: "直角箭头",
          icon: "static/images/arrow1.png",
          icona: "static/images/arrow2.png",
        },
        {
          name: "燕尾箭头",
          icon: "static/images/arrow3.png",
          icona: "static/images/arrow4.png",
        },
        {
          name: "钳击箭头",
          icon: "static/images/arrow5.png",
          icona: "static/images/arrow6.png",
        },
        {
          name: "雷达扫描",
          icon: "static/images/leida.png",
          icona: "static/images/leida1.png",
        },
        {
          name: "圆形扫描",
          icon: "static/images/shaomiao.png",
          icona: "static/images/shaomiao1.png",
        },
        {
          name: "双环扫描",
          icon: "static/images/shuanghuan.png",
          icona: "static/images/shuanghuan1.png",
        },
        {
          name: "全球自转",
          icon: "static/images/xuanzhuan.png",
          icona: "static/images/xuanzhuan1.png",
        },
        {
          name: "交通车流",
          icon: "static/images/odline.png",
          icona: "static/images/odline1.png",
        },
        {
          name: "视频投影",
          icon: "static/images/voidtexture.png",
          icona: "static/images/voidtexture1.png",
        },
      ];
    },
    //视频投影---以纹理的方式测试
    setVoidTexture() {
      let points = [
        {
          x: 1.9886012274315565,
          y: 0.39290511124517663,
          z: 20.0,
        },
        {
          x: 1.988613429113075,
          y: 0.392904584767966,
          z: 20.0,
        },
        {
          x: 1.9886132109233376,
          y: 0.3928913719460724,
          z: 20.0,
        },
        {
          x: 1.9886015657746463,
          y: 0.39289209363386446,
          z: 20.0,
        },
      ];
      let voidUri =
        "https://stream7.iqilu.com/10339/upload_transcode/202002/18/20200218114723HDu3hhxqIT.mp4";
      PrimitiveTexture({
        Cartesians: points,
        void: voidUri,
        viewer: this.$Helpers.viewer,
      });
    },
  },
};
</script>

<style>
.leftnav-box {
  position: absolute;
  top: 62px;
}

.leftnav {
  left: 7.5px;
}

.leftnav-item {
  width: 50px;
  font-size: 12px;
  padding-top: 10px;
  text-align: center;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
}

.leftnav-item img {
  width: 22px;
  height: 22px;
}

.leftnav-txt {
  line-height: 18px;
}
</style>


