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
      path: '/product-center/item/formStepOne',
      component: Layout,
      redirect: '/product-center/item/formStepOne',
      hidden: true,
      children: [
        {
          path: 'index',
          component: () => import('@/views/product-center/item/formStepOne'),
          name: 'itemFormStepOne',
          meta: { title: '商品表单', icon: 'user', noCache: true }
        }
      ]
    }
  ]
}

export default productRouter
