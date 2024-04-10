import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SenhasService {
  public senhasGeral: number = localStorage.getItem('senhaGeral') !== null ? parseInt(localStorage.getItem('senhaGeral')!) : 0;
  public senhasPrior: number = localStorage.getItem('senhaPrioritaria') !== null ? parseInt(localStorage.getItem('senhaPrioritaria')!) : 0;
  public senhasExame: number = localStorage.getItem('senhaExame') !== null ? parseInt(localStorage.getItem('senhaExame')!) : 0;
  public ultimaChamada: string = localStorage.getItem('ultimaChamada') !== null ? localStorage.getItem('ultimaChamada')! : '';
  public senhasTotal: number = this.senhasGeral + this.senhasPrior + this.senhasExame;
  public ultSenha: string = 'G';

  public filaSenhas: string[] = [];
  public ultimasSenhasAtendidas: string[] = [];
  // TODO Antes de gerar senha verifiar horário se está dentor do padrão das 7 às 17h caso n esteja n gerar senha - DONE
  // TODO Criar metodo para pegar posição final até a 5 ante final recebendo parametro de 0(final da fila) a 4(quinto elemento antes do final da fila)
  // TODO Ao  chamar no guiche usar a seguinte logica : [SP] -> [SE|SG] -> [SP] -> [SE|SG]
  // TODO Alterar padrão de nenha de N--- para : YYMMDD-PPSQ
  // TODO Criar fila juntando atendimento, guichê e status do atendimento.
  // TODO Status do guiche: Em atendimento ou vazio.
  // TODO Criar logica para finalizar atendimento enviar para fila com status: atendido ou não compareceu
  // TODO Criar relatorio com base nas filas criadas

  constructor() {
  }

  verificarHorario(): boolean {
    return (new Date().getHours() >= 7 && (new Date().getHours() <= 16 && new Date().getMinutes() <= 45));
  }

  gerarSenhaGeral() {
    if (this.verificarHorario()) {
      this.somaGeral();
      this.ultSenha = 'G';
      const senha = this.ultSenha + this.senhasGeral.toLocaleString('pt-br', {minimumIntegerDigits: 3});
      this.filaSenhas.push(senha);
      this.salvarSenhaNoLocalStorage('senhaGeral', this.senhasGeral, this.ultSenha);
    } else {
      alert("As senhas só podem ser geradas das 07:00 até às 16:45");
    }
  }

  gerarSenhaPrior() {
    if (this.verificarHorario()) {
      this.somaPrior();
      this.ultSenha = 'P';
      const senha = this.ultSenha + this.senhasPrior.toLocaleString('pt-br', {minimumIntegerDigits: 3});
      this.filaSenhas.push(senha);
      this.salvarSenhaNoLocalStorage('senhaPrioritaria', this.senhasPrior, this.ultSenha);
    } else {
      alert("As senhas só podem ser geradas das 07:00 até às 16:45");
    }
  }

  gerarSenhaExame() {
    if (this.verificarHorario()) {
      this.somaExame();
      this.ultSenha = 'E';
      const senha = this.ultSenha + this.senhasExame.toLocaleString('pt-br', {minimumIntegerDigits: 3});
      this.filaSenhas.push(senha);
      this.salvarSenhaNoLocalStorage('senhaExame', this.senhasExame, this.ultSenha);
    } else {
      alert("As senhas só podem ser geradas das 07:00 até às 16:45");
    }
  }

  mostrarSenha() {
    if (this.ultSenha === 'G') {
      return 'G' + this.senhasGeral.toLocaleString('pt-br', {minimumIntegerDigits: 3});
    } else if (this.ultSenha === 'P') {
      return 'P' + this.senhasPrior.toLocaleString('pt-br', {minimumIntegerDigits: 3});
    } else {
      return 'E' + this.senhasExame.toLocaleString('pt-br', {minimumIntegerDigits: 3});
    }
  }

  private somaGeral() {
    this.senhasGeral++;
    this.senhasTotal++;
  }

  private somaPrior() {
    this.senhasPrior++;
    this.senhasTotal++;
  }

  private somaExame() {
    this.senhasExame++;
    this.senhasTotal++;
  }

  private salvarSenhaNoLocalStorage(chave: string, valor: number, ultSenha: string) {
    localStorage.setItem(chave, valor.toString())
    localStorage.setItem('ultimaChamada', ultSenha + valor.toLocaleString('pt-br', {minimumIntegerDigits: 3}))
  }
}
