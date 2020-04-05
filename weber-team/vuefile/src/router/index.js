import Vue from 'vue'
import Router from 'vue-router'
import details from '@/components/index'
import LyncPeople from '@/components/LyncPeople'
import ProblemList from '@/components/ProblemList'
import DeviceList from '@/components/DeviceList'
import favorite from '@/components/favorite'
import versionPath from '@/components/versionPath'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      name: "DeviceList",
      component: DeviceList
    },
    {
      path: '/details',
      name: 'details',
      component: details
    },
    {
      path: "/LyncPeople",
      name: "LyncPeople",
      component: LyncPeople
    },
    {
      path: "/ProblemList",
      name: "ProblemList",
      component: ProblemList
    },
    {
      path: "/favorite",
      name: "favorite",
      component: favorite
    },
    {
      path: "/versionPath",
      name: "versionPath",
      component: versionPath
    }
  ]
})