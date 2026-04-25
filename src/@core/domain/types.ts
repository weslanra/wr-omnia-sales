export interface ICpfCnpj {
  valor: string;
  ehValido: true | string;
  valueOf: string;
  tipo: "CPF" | "CNPJ" | null;

  validar(valor: string): void;
}

export abstract class ValueObjects {
  abstract valor: unknown;
  abstract ehValido: true | string;
  abstract valueOf: unknown;

  abstract validar(valor: unknown): unknown;
  static formatar(valor: unknown): unknown {
    return valor;
  }
}
