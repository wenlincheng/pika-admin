import Layout from '@/layout'

const orderRouter = {
  path: '/trade-center',
  component: Layout,
  redirect: '/trade-center/item',
  name: 'OrderCenter',
  meta: {
    title: '订单中心',
    icon: 'component'
  },
  children: [
    {
      path: '/trade-center/order',
      component: () => import('@/views/trade-center/order'),
      name: 'Order',
      meta: {
        title: '订单管理',
        icon: 'peoples'
      }
    },
    {
      path: '/trade-center/refund',
      component: () => import('@/views/trade-center/refund'),
      name: 'Refund',
      meta: {
        title: '维权管理',
        icon: 'role'
      }
    },
    {
      path: '/trade-center/evaluation',
      component: () => import('@/views/trade-center/evaluation'),
      name: 'Comment',
      meta: {
        title: '评价管理',
        icon: 'table'
      }
    }
  ]
}

export default orderRouter
