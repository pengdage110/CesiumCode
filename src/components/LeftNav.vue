<template>
    <div class="leftnav-box leftnav">
        <div  class="leftnav-item" v-for="obj in navList" :key="obj.name" @click="switchNavName(obj.name)">
           <img :src="navName==obj.name?obj.icona:obj.icon" alt="">
           <div>{{obj.name}}</div>
        </div>
    </div>
</template>

<script>
export default {
  name: "leftnav",
  data() {
    return {
      navList: [],
      navName: ""
    };
  },
  created() {
    this.setNavList()
  },

  methods: {
    switchNavName(name) {
        if(this.navName===name){
            this.navName=''
            return
        }
        this.navName = name;
        switch(name){
            case "距离测量":
            break;
            case "面积测量":
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


