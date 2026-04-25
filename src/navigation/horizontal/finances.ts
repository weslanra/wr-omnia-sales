export default [
  {
    title: "Financeiro",
    icon: { icon: "tabler-plus" },
    children: [
      {
        title: "Contas",
        icon: { icon: "tabler-cash" },
        to: "finances-account",
      },
      {
        title: "Fluxo de caixa",
        icon: { icon: "tabler-circle-check" },
        to: "finances-flow-cash",
      },
      {
        title: "Contas a pagar",
        icon: { icon: "tabler-calendar-dollar" },
        to: "finances-account-payable",
      },
      {
        title: "Contas a receber",
        icon: { icon: "tabler-moneybag" },
        to: "finances-account-receivable",
      },
      {
        title: "Relatórios",
        icon: { icon: "tabler-package" },
        to: "finances-report",
      },
    ],
  },
];
