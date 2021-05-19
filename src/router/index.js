import Vue from 'vue'
import Router from 'vue-router'
import Map3D from '@/components/Map3D'
import leftnav from '@/components/LeftNav'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Map3D',
      component: Map3D
    },
    {
      path:"/leftnav",
      name:"leftnav",
      component:leftnav
    },
  ]
})
