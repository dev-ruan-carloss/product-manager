import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/produtos',
    },
    {
      path: '/produtos',
      name: 'produtos',
      component: () => import('@/views/ProdutosView.vue'),
    },
    {
      path: '/produtos/novo',
      name: 'produto-criar',
      component: () => import('@/views/ProdutoCriarView.vue'),
    },
    {
      path: '/produtos/:id/editar',
      name: 'produto-editar',
      component: () => import('@/views/ProdutoEditarView.vue'),
    },
    {
      path: '/produtos/:id',
      name: 'produto-detalhes',
      component: () => import('@/views/ProdutoDetalhesView.vue'),
    },
    {
      path: '/favoritos',
      name: 'favoritos',
      component: () => import('@/views/FavoritosView.vue'),
    },
  ],
})

export default router
