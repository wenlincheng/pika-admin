/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/user',
  alwaysShow: true,
  name: 'Organization',
  meta: {
    title: '系统管理',
    roles: ['admin', 'editor'],
    icon: 'component'
  },
  children: [
    {
      path: '/system/user',
      component: () => import('@/views/system/user'),
      name: 'User',
      meta: {
        title: '用户管理',
        icon: 'peoples',
        roles: ['admin', 'editor']
      }
    },
    {
      path: '/system/role',
      component: () => import('@/views/system/role'),
      name: 'Role',
      meta: {
        title: '角色管理',
        icon: 'role',
        roles: ['admin', 'editor']
      }
    },
    {
      path: '/system/menu',
      component: () => import('@/views/system/menu'),
      name: 'Menu',
      meta: {
        title: '菜单管理',
        icon: 'table',
        roles: ['admin', 'editor']
      }
    },
    {
      path: '/system/group',
      component: () => import('@/views/system/group'),
      name: 'Group',
      meta: {
        title: '组织架构',
        icon: 'group'
      }
    }, {
      path: '/system/gateway',
      component: () => import('@/views/system/gateway'),
      name: 'Gateway',
      meta: {
        title: '路由管理',
        icon: 'guide'
      }
    }
  ]
}

export default systemRouter
