export default [
  {
    title: "Configuracoes",
    icon: { icon: "tabler-settings" },
    children: [
      {
        title: "Usuários",
        icon: { icon: "tabler-users" },
        to: "settings-user",
      },
      {
        title: "Perfil",
        icon: { icon: "tabler-user-shield" },
        to: "records-profile",
      },
      {
        title: "Empresa",
        icon: { icon: "tabler-building" },
        to: "settings-company",
      },
      {
        title: "Ponto de venda",
        icon: { icon: "tabler-shopping-cart-plus" },
        to: "settings-point-of-sale",
      },
      {
        title: "Instituição financeira",
        icon: { icon: "tabler-users" },
        to: "records-client",
      },
      {
        title: "Campos obrigatórios",
        icon: { icon: "tabler-shield-lock" },
        to: "records-client",
        children: [
          {
            title: "Cliente",
            to: "settings-required-field-client",
          },
          {
            title: "Produtos",
            to: "settings-required-field-product",
          },
        ],
      },
      {
        title: "Parâmetros",
        icon: { icon: "tabler-users" },
        to: "records-client",
        children: [
          {
            title: "Do grupo",
            to: "dashboards-analytics",
          },
        ],
      },
    ],
  },
];
