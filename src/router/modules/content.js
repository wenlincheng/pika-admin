import Layout from '@/layout'

const contentRouter = {
  path: '/content-center',
  component: Layout,
  redirect: '/content-center/item',
  name: 'ContentCenter',
  meta: {
    title: '内容中心',
    icon: 'component'
  },
  children: [
    {
      path: '/content-center/material',
      component: () => import('@/views/content-center/material'),
      name: 'Material',
      meta: {
        title: '素材管理',
        icon: 'peoples'
      }
    }
  ]
}

export default contentRouter
