import Layout from '@/layout'

const orderRouter = {
  path: '/order-center',
  component: Layout,
  redirect: '/order-center/item',
  name: 'OrderCenter',
  meta: {
    title: '订单中心',
    icon: 'component'
  },
  children: [
    {
      path: '/order-center/order',
      component: () => import('@/views/order-center/order'),
      name: 'Order',
      meta: {
        title: '订单管理',
        icon: 'peoples'
      }
    },
    {
      path: '/order-center/refund',
      component: () => import('@/views/order-center/refund'),
      name: 'Refund',
      meta: {
        title: '维权管理',
        icon: 'role'
      }
    },
    {
      path: '/order-center/comment',
      component: () => import('@/views/order-center/comment'),
      name: 'Comment',
      meta: {
        title: '评价管理',
        icon: 'table'
      }
    }
  ]
}

export default orderRouter
