import Layout from '@/layout'

const memberRouter = {
  path: '/member-center',
  component: Layout,
  redirect: '/member-center/member',
  name: 'MemberCenter',
  meta: {
    title: '客户中心',
    icon: 'component'
  },
  children: [
    {
      path: '/member-center/member',
      component: () => import('@/views/member-center/member'),
      name: 'Member',
      meta: {
        title: '客户管理',
        icon: 'role'
      }
    },
    {
      path: '/member-center/tag',
      component: () => import('@/views/member-center/tag'),
      name: 'Tag',
      meta: {
        title: '标签管理',
        icon: 'role'
      }
    }
  ]
}

export default memberRouter
