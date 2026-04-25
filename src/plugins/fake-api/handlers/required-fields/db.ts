import { RequiredField } from "@/plugins/fake-api/handlers/required-fields/types";

export const databaseClient: RequiredField[] = [
  {
    field: "codigo",
    required: true,
    optional: false,
  },
  {
    field: "nome",
    required: true,
    optional: true,
  },
  {
    field: "municipioNome",
    required: true,
    optional: true,
  },
  {
    field: "uf",
    required: true,
    optional: true,
  },
  {
    field: "telefone",
    required: true,
    optional: true,
  },
  {
    field: "tipo",
    required: true,
    optional: true,
  },
  {
    field: "cpfCnpj",
    required: true,
    optional: true,
  },
  {
    field: "email",
    required: true,
    optional: true,
  },
  {
    field: "avatar",
    required: true,
    optional: true,
  },
  {
    field: "adimplente",
    required: true,
    optional: true,
  },
];

export const databaseProduct: RequiredField[] = [
  {
    field: "codigo",
    required: true,
    optional: false,
  },
  {
    field: "nome",
    required: true,
    optional: false,
  },
  {
    field: "unidade",
    required: false,
    optional: false,
  },
  {
    field: "preco",
    required: true,
    optional: false,
  },
  {
    field: "qtdEstoque",
    required: false,
    optional: true,
  },
];
