import Layout from '@/layout'

const productRouter = {
  path: '/product-center',
  component: Layout,
  redirect: '/product-center/item',
  name: 'Product',
  meta: {
    title: '商品中心',
    icon: 'component'
  },
  children: [
    {
      path: '/product-center/item',
      component: () => import('@/views/product-center/item'),
      name: 'Item',
      meta: {
        title: '商品管理',
        icon: 'peoples'
      }
    },
    {
      path: '/product-center/category',
      component: () => import('@/views/product-center/category'),
      name: 'Category',
      meta: {
        title: '分类管理',
        icon: 'role'
      }
    },
    {
      path: '/product-center/group',
      component: () => import('@/views/product-center/group'),
      name: 'Group',
      meta: {
        title: '分组管理',
        icon: 'table'
      }
    }
  ]
}

export default productRouter
