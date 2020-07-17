import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/ol01',
      name: 'ol01',
      component: () => import('@/components/ol-01')
    },
    {
      path: '/ol02',
      name: 'ol02',
      component: () => import('@/components/ol-02')
    },
    {
      path: '/ol03',
      name: 'ol03',
      component: () => import('@/components/ol-03')
    },
    {
      path: '/ol04',
      name: 'ol04',
      component: () => import('@/components/ol-04')
    }
  ]
})
