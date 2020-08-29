import Layout from '@/layout'

const marketingRouter = {
  path: '/marketing-center',
  component: Layout,
  redirect: '/marketing-center/discount',
  name: 'MarketingCenter',
  meta: {
    title: '营销中心',
    icon: 'component'
  },
  children: [
    {
      path: '/marketing-center/coupon',
      component: () => import('@/views/marketing-center/coupon'),
      name: 'Coupon',
      meta: {
        title: '优惠券',
        icon: 'role'
      }
    },
    {
      path: '/marketing-center/card',
      component: () => import('@/views/marketing-center/card'),
      name: 'Card',
      meta: {
        title: '权益卡',
        icon: 'role'
      }
    },
    {
      path: '/marketing-center/discount',
      component: () => import('@/views/marketing-center/discount'),
      name: 'Discount',
      meta: {
        title: '限时折扣',
        icon: 'peoples'
      }
    },
    {
      path: '/marketing-center/group',
      component: () => import('@/views/marketing-center/group'),
      name: 'Group',
      meta: {
        title: '多人拼团',
        icon: 'role'
      }
    }
  ]
}

export default marketingRouter
