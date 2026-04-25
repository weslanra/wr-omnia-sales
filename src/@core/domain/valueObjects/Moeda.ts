export interface Options {
  prefix?: string;
  suffix?: string;
  separator: string;
  decimal: string;
  precision?: number;
  min?: number;
  max?: number;
}

export const FORMATO_PADRAO_BR: Options = {
  decimal: ",",
  separator: ".",
  prefix: "R$ ",
  precision: 2,
  min: 0,
};

function between(min: number, n: number, max: number) {
  return Math.max(min, Math.min(n, max));
}

function fixed(precision: number) {
  return between(0, precision, 20);
}
export default class Moeda {
  private _valor!: string;
  private _formatador: Options;

  constructor(
    valor: string | number | null,
    formatador: Partial<Options> = FORMATO_PADRAO_BR
  ) {
    this._formatador = { ...FORMATO_PADRAO_BR, ...formatador };
    this.valor = valor;
  }

  get valor(): string {
    return this._valor;
  }

  set valor(valor: number | string | null) {
    if (typeof valor === "number") {
      valor = this.limitarValor(valor);
      valor = this.setValorNumericoAntesDeFixarDecimais(valor!);
    }
    this._valor = this.formatarELimitarValor(valor);
  }

  private valorDeveSerAnulado(valor: string | number): boolean {
    return this.valueOf() === 0 && valor.toString().length < this._valor.length;
  }

  private formatarELimitarValor(valor: number | string | null): string {
    if (
      valor === null ||
      valor === "" ||
      this.valorDeveSerAnulado(valor) ||
      this.sanitizar(valor.toString()) === null
    ) {
      return "";
    }
    if (typeof valor === "number") {
      valor = valor.toString().replace(".", this._formatador.decimal);
    }
    let valorFormatado = this.formatar(valor.toString());
    return valorFormatado;
  }

  setValorNumericoAntesDeFixarDecimais(valor: number): number {
    const { precision } = this._formatador;
    valor = Number(valor.toFixed(precision));
    const exp = Math.pow(10, precision!);
    return Number((valor * exp).toFixed(precision));
  }

  private toFixed(valor: string, ehNegativo: boolean) {
    const { precision, decimal } = this._formatador;
    const fator = ehNegativo ? -1 : 1;
    const exp = Math.pow(10, precision!);
    const float = (parseFloat(valor) || 0) / exp || 0;
    const valorLimitado = this.limitarValor(float * fator);
    return (
      valorLimitado?.toFixed(fixed(precision!)).replace(".", decimal) || null
    );
  }

  private limitarValor(valor: number | null) {
    if (valor === null) {
      return null;
    }

    const { min = 0, max } = this._formatador;

    if (valor < min) {
      return min;
    } else if (max !== undefined && valor > max) {
      return max;
    }
    return valor;
  }

  public sanitizar(valor: string): number | null {
    if (!valor) return null;
    const { decimal, separator, min } = this._formatador;
    const sinal = "-";
    const ehNegativo = !!min && min < 0 && valor.includes(sinal);
    let cleanedString = valor
      .replaceAll(separator, "")
      .replace(decimal, ".")
      .replace(/[^0-9.]/g, "");

    if (!cleanedString && valor !== sinal) return null;

    const fator = ehNegativo ? -1 : 1;
    let valorNumerico = parseFloat(cleanedString);
    return !isNaN(valorNumerico) ? valorNumerico * fator : null;
  }

  // TODO: seria bom se essa função se tornar static assim como CPF.formatar para não precisar criar uma instância de Moeda toda vez que for formatar um valor
  public formatar(valor: string) {
    const { separator, min } = this._formatador;
    const ehNegativo = !!min && min < 0 && valor.includes("-");
    let cleanedString = valor.replaceAll(separator, "").replace(/[^0-9]/g, "");

    const fixed = this.toFixed(cleanedString, ehNegativo);
    const valorFormatado = this.formatarValorComSeparadores(fixed);

    return this.concatenarValores(valorFormatado, ehNegativo);
  }

  concatenarValores(valor: string, ehNegativo: boolean) {
    const { prefix = "", suffix = "" } = this._formatador;
    const sinal = ehNegativo ? "-" : "";
    return prefix + sinal + valor + suffix;
  }

  formatarValorComSeparadores(valorNumerico: string | null): string {
    if (valorNumerico === null) return "";
    const { separator, decimal } = this._formatador;
    const sinal = "-";
    const [parteInteira, parteDecimal] = valorNumerico.split(decimal);
    const parteInteiraFormatada = Number(parteInteira)
      .toString()
      .replace(/(\d)(?=(?:\d{3})+\b)/gm, `$1${separator}`)
      .replace(sinal, "");

    return parteDecimal
      ? `${parteInteiraFormatada}${decimal}${parteDecimal}`
      : parteInteiraFormatada;
  }

  valueOf(): number | null {
    return this.sanitizar(this.valor);
  }
}
