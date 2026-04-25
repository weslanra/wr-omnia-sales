export default class Email {
    private _valor: string;
    private _ehValido: true | string = true;
  
    constructor(nome: string) {
      this.validar(nome);
  
      this._valor = nome;
    }
  
    set valor(v: string) {
      this.validar(v);
  
      this._valor = v;
    }
  
    get valor(): string {
      return this._valor;
    }
  
    get ehValido() {
      return this._ehValido;
    }
  
    public validar(valor: string) {
      if (isEmpty(valor)) {
        this._ehValido = true;
        return;
      } 
      const re = /^(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*|".+")@(?:\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]|(?:[a-z\-\d]+\.)+[a-z]{2,})$/i
  
      if(re.test(String(valor))) {
          this._ehValido = true;
          return;
      }
      this._ehValido = 'O campo Email deve ser um email válido';
    }
  }
  