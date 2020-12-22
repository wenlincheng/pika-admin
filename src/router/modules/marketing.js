import Layout from '@/layout'

const marketingRouter = {
  path: '/promotion-center',
  component: Layout,
  redirect: '/promotion-center/discount',
  name: 'MarketingCenter',
  meta: {
    title: '营销中心',
    icon: 'component'
  },
  children: [
    {
      path: '/promotion-center/coupon',
      component: () => import('@/views/promotion-center/coupon'),
      name: 'Coupon',
      meta: {
        title: '优惠券',
        icon: 'role'
      }
    },
    {
      path: '/promotion-center/card',
      component: () => import('@/views/promotion-center/card'),
      name: 'Card',
      meta: {
        title: '权益卡',
        icon: 'role'
      }
    },
    {
      path: '/promotion-center/discount',
      component: () => import('@/views/promotion-center/discount'),
      name: 'Discount',
      meta: {
        title: '限时折扣',
        icon: 'peoples'
      }
    },
    {
      path: '/promotion-center/group',
      component: () => import('@/views/promotion-center/group'),
      name: 'Group',
      meta: {
        title: '多人拼团',
        icon: 'role'
      }
    }
  ]
}

export default marketingRouter
