import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/pages/Login'
import Admin from '@/components/pages/Admin'
import Category from '@/components/pages/Category'
import Supplier from '@/components/pages/Supplier'
import Product from '@/components/pages/Product'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      redirect: {path: "login"}
    },

    {
      path: '/login',
      name: 'login',
      component: Login
    },

    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      redirect: {path: '/admin/category'},
      children: [
        {
          path: 'category',
          name: 'admin.category',
          component: Category
        },

        {
          path: 'supplier',
          name: 'admin.supplier',
          component: Supplier
        },

        {
          path: 'product',
          name: 'admin.product',
          component: Product
        }
        
      ]
    }
  ],

  mode: 'history'
})
