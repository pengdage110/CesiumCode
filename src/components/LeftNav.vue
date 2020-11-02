<template>
    <div class="leftnav-box leftnav">
        <div  class="leftnav-item" v-for="obj in navList" :key="obj.name" @click="switchNavName(obj.name)">
           <img :src="navName==obj.name?obj.icona:obj.icon" alt="">
           <div>{{obj.name}}</div>
        </div>
    </div>
</template>

<script>
import leftnavmixin from "@/minixs/LeftNavMinix"
import measureminix from "@/minixs/MeasureMinix"
export default {
  name: "leftnav",
  mixins: [leftnavmixin,measureminix],
  data() {
    return {
      navList: [],
      navName: ""
    };
  },
  created() {
    this.setNavList();
  },

  methods: {
    switchNavName(name) {
      if (this.navName === name) {
        this.navName = "";
        //取消点选功能状态
        this.UnSelect();
        return;
      }
      this.navName = name;
      switch (name) {
        case "距离测量":
          this.measureLineSpace(this.$Helpers.viewer);      
          break;
        case "面积测量":
       
          break;
        case "点击查询":
          this.featureSelcet();
          break;
      }
    },
    setNavList() {
      this.navList = [
        {
          name: "距离测量",
          icon: "static/images/width-test-icon.svg",
          icona: "static/images/width-test-icon-a.svg"
        },
        {
          name: "面积测量",
          icon: "static/images/acreage-test-icon.svg",
          icona: "static/images/acreage-test-icon-a.svg"
        },
        {
          name: "点击查询",
          icon: "static/images/select1.png",
          icona: "static/images/select2.png"
        }
      ];
    }
  }
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


