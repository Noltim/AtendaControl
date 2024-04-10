import {Injectable} from '@angular/core';
import {Senhas} from "../models/senhas";
import {Prioridades} from "../models/prioridades";
import {formatDate} from '@angular/common';
import {registerLocaleData} from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);


@Injectable({
  providedIn: 'root'
})
export class SenhasService {
  public senhasGeral: number = localStorage.getItem('senhaGeral') !== null ? parseInt(localStorage.getItem('senhaGeral')!) : 0;
  public senhasPrior: number = localStorage.getItem('senhaPrioritaria') !== null ? parseInt(localStorage.getItem('senhaPrioritaria')!) : 0;
  public senhasExame: number = localStorage.getItem('senhaExame') !== null ? parseInt(localStorage.getItem('senhaExame')!) : 0;
  public ultimaChamada: string = localStorage.getItem('ultimaChamada') !== null ? localStorage.getItem('ultimaChamada')! : '';
  public senhasTotal: number = this.senhasGeral + this.senhasPrior + this.senhasExame;
  public ultSenha: string = "SG";

  // TODO Ao  chamar no guiche usar a seguinte logica : [SP] -> [SE|SG] -> [SP] -> [SE|SG]
  // TODO Criar fila juntando atendimento, guichê e status do atendimento.
  // TODO Status do guiche: Em atendimento ou vazio.
  // TODO Criar logica para finalizar atendimento enviar para fila com status: atendido ou não compareceu
  // TODO Criar relatorio com base nas filas criadas

  constructor() {
  }

  verificarHorario(): boolean {
    return (new Date().getHours() >= 7 && (new Date().getHours() <= 16 || new Date().getMinutes() <= 45));
  }

  gerarSenha(prioridade: string) {
    let filaString = localStorage.getItem("fila");
    let fila = filaString ? JSON.parse(filaString) : [];

    if (this.verificarHorario()) {
      switch (prioridade) {
        case "SG": {
          this.somaGeral();
          this.ultSenha = "SG";
          const senha = new Senhas();
          senha.dataHoraEmissao = formatDate(new Date(), 'dd-MM-yyyy HH:mm:ss', 'pt-BR', '3');
          senha.prioridade = Prioridades.SG;
          senha.sequencial = this.senhasGeral;
          fila.push(senha);
          localStorage.setItem("fila", JSON.stringify(fila));
          this.salvarSenhaNoLocalStorage('senhaGeral', this.senhasGeral, this.ultSenha);
          break;
        }

        case "SP": {
          this.somaPrior();
          this.ultSenha = "SP";
          const senha = new Senhas();
          senha.dataHoraEmissao = formatDate(new Date(), 'dd-MM-yyyy HH:mm:ss', 'pt-BR', '3');
          senha.prioridade = Prioridades.SP;
          senha.sequencial = this.senhasPrior;
          fila.push(senha);
          localStorage.setItem("fila", JSON.stringify(fila));
          this.salvarSenhaNoLocalStorage('senhaPrioritaria', this.senhasPrior, this.ultSenha);
          break;
        }

        case "SE": {
          this.somaExame();
          this.ultSenha = "SE";
          const senha = new Senhas();
          senha.dataHoraEmissao = formatDate(new Date(), 'dd-MM-yyyy HH:mm:ss', 'pt-BR', '3');
          senha.prioridade = Prioridades.SE;
          senha.sequencial = this.senhasExame;
          fila.push(senha);
          localStorage.setItem("fila", JSON.stringify(fila));
          this.salvarSenhaNoLocalStorage('senhaExame', this.senhasExame, this.ultSenha);
          break;
        }
      }
    } else {
      alert("As senhas só podem ser geradas das 07:00 até às 16:45");
    }
  }

  ultimasSenhasAtendidas() {
    let item = localStorage.getItem("fila");
    let filaRecuperada = item ? JSON.parse(item) : [];
    let filaUltimosAtendidos = []

    for (let i = 0; i < filaRecuperada.length; i++) {
      if (filaRecuperada[i].statusAtendimento) {
        filaUltimosAtendidos.push(filaRecuperada[i]);
      }

      if (filaUltimosAtendidos.length > 5) {
        break;
      }
    }
    return filaUltimosAtendidos;
  }

  mostrarSenha() {
    if (this.ultSenha === "SG") {
      return "SG" + this.senhasGeral.toLocaleString('pt-br', {minimumIntegerDigits: 3});
    } else if (this.ultSenha === "SP") {
      return "SP" + this.senhasPrior.toLocaleString('pt-br', {minimumIntegerDigits: 3});
    } else {
      return "SE" + this.senhasExame.toLocaleString('pt-br', {minimumIntegerDigits: 3});
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
