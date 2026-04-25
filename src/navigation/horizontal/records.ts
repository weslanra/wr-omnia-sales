export default [
  {
    title: 'Cadastros',
    icon: { icon: 'tabler-plus' },
    children: [
      {
        title: 'Clientes',
        icon: { icon: 'tabler-users' },
        to: 'records-client',
      },
      {
        title: 'Fornecedores',
        icon: { icon: 'tabler-truck-delivery' },
        to: 'records-supplier',
      },
      {
        title: 'Produtos',
        icon: { icon: 'tabler-package' },
        to: 'records-product',
      },
    ],
  },
]
