// 👉 Client
export interface Client {
  id: number;
  codigo: string;
  cpfCnpj: string;
  nome: string;
  municipioNome: string;
  uf: string;
  telefone: string;
  tipo: TipoCliente | string;
  avatar: string;
  email: string;
  adimplente: boolean;
}

export enum TipoCliente {
  CLIENTE = "Cliente",
  FORNECEDOR = "Fornecedor",
}
