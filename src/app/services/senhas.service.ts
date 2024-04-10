import { Injectable } from '@angular/core';

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
  //Antes de gerar senha verifiar horário se está dentor do padrão das 7 às 17h caso n esteja n gerar senha
  // Criar metodo para pegar posição final até a 5 ante final recebendo parametro de 0(final da fila) a 4(quinto elemento antes do final da fila)
  // Ao  chamar no guiche usar a seguinte logica : [SP] -> [SE|SG] -> [SP] -> [SE|SG]
  // Alterar padrão de nenha de N--- para : YYMMDD-PPSQ
  //Criar fila juntando atendimento, guichê e status do atendimento.
  //Status do guiche: Em atendimento ou vazio.
  //Criar logica para finalizar atendimento enviar para fila com status: atendido ou não compareceu
  //Criar relatorio com base nas filas criadas

  constructor() {
  }

  gerarSenhaGeral() {
    this.somaGeral();
    this.ultSenha = 'G';
    const senha = this.ultSenha + this.senhasGeral.toLocaleString('pt-br', { minimumIntegerDigits: 3 });
    this.filaSenhas.push(senha);
    this.salvarSenhaNoLocalStorage('senhaGeral', this.senhasGeral, this.ultSenha);
  }

  gerarSenhaPrior() {
    this.somaPrior();
    this.ultSenha = 'P';
    const senha = this.ultSenha + this.senhasPrior.toLocaleString('pt-br', { minimumIntegerDigits: 3 });
    this.filaSenhas.push(senha);
    this.salvarSenhaNoLocalStorage('senhaPrioritaria', this.senhasPrior, this.ultSenha);
  }

  gerarSenhaExame() {
    this.somaExame();
    this.ultSenha = 'E';
    const senha = this.ultSenha + this.senhasExame.toLocaleString('pt-br', { minimumIntegerDigits: 3 });
    this.filaSenhas.push(senha);
    this.salvarSenhaNoLocalStorage('senhaExame', this.senhasExame, this.ultSenha);
  }

  mostrarSenha() {
    if (this.ultSenha === 'G') {
      return 'G' + this.senhasGeral.toLocaleString('pt-br', { minimumIntegerDigits: 3 });
    } else if (this.ultSenha === 'P') {
      return 'P' + this.senhasPrior.toLocaleString('pt-br', { minimumIntegerDigits: 3 });
    } else {
      return 'E' + this.senhasExame.toLocaleString('pt-br', { minimumIntegerDigits: 3 });
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
    localStorage.setItem('ultimaChamada', ultSenha + valor.toLocaleString('pt-br', { minimumIntegerDigits: 3 }))
  }
}
