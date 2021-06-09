<template>
  <div class="rightnav-box rightnav">
    <div
      class="rightnav-item"
      v-for="obj in navArry"
      :key="obj.name"
      @click="switchNavName(obj.name)"
    >
      <img :src="navName == obj.name ? obj.icona : obj.icon" alt="" />
      <div>{{ obj.name }}</div>
    </div>
  </div>
</template>

<script>
import rightnavmixin from "@/minixs/RightNavMinix";
export default {
  name: "rightnav",
  mixins: [rightnavmixin],
  data() {
    return {
      navArry: [],
      navName: "",
    };
  },
  created() {
    this.setnavArry();
  },

  methods: {
    setnavArry() {
      this.navArry = [
        {
          name: "模型加载",
          icon: "static/images/width-test-icon.svg",
          icona: "static/images/width-test-icon-a.svg",
        },
      ];
    },

    switchNavName(name) {
      if (this.navName === name) {
        this.navName = "";
        return;
      }
      this.navName = name;
      switch (name) {
        case "模型加载":
          this.loadInddorModel();
          //this.loadModel();
          break;
      }
    },
  },
};
</script>

<style scoped>
.rightnav-box {
  position: absolute;
  top: 62px;
}
.rightnav {
  right: 7.5px;
}
.rightnav-item {
  width: 50px;
  font-size: 12px;
  padding-top: 10px;
  text-align: center;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
}
.rightnav-item img {
  width: 22px;
  height: 22px;
}
.rightnav-txt {
  line-height: 18px;
}
</style>