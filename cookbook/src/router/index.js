import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/pages/HomeView.vue'
import { useLoginStore } from '@/stores/login'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: () => import('../views/pages/RecipesView.vue'),
    },
    {
      path: '/dishes',
      name: 'dishes',
      component: () => import('../views/pages/DishesView.vue'),
    },
    {
      path: '/register',
      name: 'registration',
      component: () => import('../views/pages/RegView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/pages/LogInView.vue'),
    },
    {
      path: '/myProfile',
      name: 'myProfile',
      component: () => import('../components/UserProfile.vue'),
    },
    {
      path: '/myRecipes',
      name: 'myRecipes',
      component: () => import('../views/pages/user/MyRecipesView.vue'),
    },
    {
      path: '/myFavorites',
      name: 'myFavorites',
      component: () => import('../views/pages/user/MyFavoritesView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/pages/admin/AdminPanelView.vue'),
      meta: {
        requiresAdmin: true,
      },
    },
    {
      path: '/recipe/view',
      name: 'recipe/view',
      component: () => import('../components/RecipeRead.vue'),
    },

    {
      path: '/create',
      name: 'create',
      component: () => import('../views/pages/CreateRecipeView.vue'),
    },
    {
      path: '/edit',
      name: 'edit',
      component: () => import('../components/RecipeEdit.vue'),
    },
    {
      path: '/admin/ings',
      name: 'admin/ings',
      component: () => import('../components/AdminIng.vue'),
    },
    {
      path: '/admin/ings/edit',
      name: 'admin/ings/edit',
      component: () => import('../components/AdminEditIng.vue'),
    },
    {
      path: '/admin/ings/create',
      name: 'admin/ings/create',
      component: () => import('../components/AdminCreateIng.vue'),
    },
    {
      path: '/admin/dish',
      name: 'admin/dish',
      component: () => import('../components/AdminDish.vue'),
    },
    {
      path: '/admin/dish/edit',
      name: 'admin/dish/edit',
      component: () => import('../components/AdminEditDish.vue'),
    },
    {
      path: '/admin/dish/create',
      name: 'admin/dish/create',
      component: () => import('../components/AdminCreateDish.vue'),
    },
    {
      path: '/myProfile/edit',
      name: 'myProfile/edit',
      component: () => import('../components/UserEdit.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin) {
    const store = useLoginStore()
    if (store.isLoggedIn || store.isAdmin) {
      next()
    } else {
      next({ name: 'login' })
    }
  } else {
    next()
  }
})

export default router
