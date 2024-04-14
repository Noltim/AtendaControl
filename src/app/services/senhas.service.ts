import { Injectable } from '@angular/core';
import { Senhas } from "../models/senhas";
import { Prioridades } from "../models/prioridades";
import { formatDate } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SenhasService {

  public atendentes: string[] = ["Dielder Gabriel Arruda Leal", "Jailton Inácio dos Santos Junior", "José Milton de Oliveira Neto", "Lucas Crespo Rodrigues", "Leonardo Emanuel Souza dos Santos"];

  public senhasGeral: number = localStorage.getItem('senhaGeral') !== null ? parseInt(localStorage.getItem('senhaGeral')!) : 0;
  public senhasPrior: number = localStorage.getItem('senhaPrioritaria') !== null ? parseInt(localStorage.getItem('senhaPrioritaria')!) : 0;
  public senhasExame: number = localStorage.getItem('senhaExame') !== null ? parseInt(localStorage.getItem('senhaExame')!) : 0;
  public ultimaGerada: string = localStorage.getItem('ultimaGerada') !== null ? localStorage.getItem('ultimaGerada')! : '';
  public senhasTotal: number = this.senhasGeral + this.senhasPrior + this.senhasExame;
  public ultSenha: string = "SG";
  public senhasGeradas: string[] = localStorage.getItem("senhasGeradas") !== null ? JSON.parse(localStorage.getItem("senhasGeradas")!) : [];

  // Variáveis para contar as senhas atendidas por tipo
  public senhasAtendidasTotal: number = 0;
  public senhasAtendidasGeral: number = 0;
  public senhasAtendidasPrior: number = 0;
  public senhasAtendidasExame: number = 0;

  public ultimasSenhasChamadas: { [key: string]: string } = {}; // Variável para armazenar a última senha chamada por cada atendente
  public senhasDisponiveis: boolean;

  constructor() {
    this.senhasDisponiveis = this.verificarSenhasDisponiveis();
  }

  private verificarSenhasDisponiveis(): boolean {
    // Verifica se há senhas na fila não atendidas
    let filaString = localStorage.getItem("fila");
    let fila = filaString ? JSON.parse(filaString) : [];
    return fila.some((senha: Senhas) => !senha.statusAtendimento);
  }

  public gerarSenha(prioridade: string): void {
    if (this.verificarHorario()) {
      let filaString = localStorage.getItem("fila");
      let fila = filaString ? JSON.parse(filaString) : [];

      let senha: Senhas;
      switch (prioridade) {
        case "SG":
          this.somaGeral();
          this.ultSenha = "SG";
          senha = this.criarSenha(Prioridades.SG);
          break;
        case "SP":
          this.somaPrior();
          this.ultSenha = "SP";
          senha = this.criarSenha(Prioridades.SP);
          break;
        case "SE":
          this.somaExame();
          this.ultSenha = "SE";
          senha = this.criarSenha(Prioridades.SE);
          break;
        default:
          console.log("Prioridade inválida.");
          return;
      }

      // Adiciona a senha à fila
      fila.push(senha);
      localStorage.setItem("fila", JSON.stringify(fila));

      // Atualiza a disponibilidade de senhas
      this.senhasDisponiveis = this.verificarSenhasDisponiveis();
    } else {
      console.log("As senhas só podem ser geradas das 07:00 até às 16:45");
    }
  }

  public atenderSenha(atendente: string): void {
    if (this.senhasDisponiveis) {
      let filaString = localStorage.getItem("fila");
      let fila = filaString ? JSON.parse(filaString) : [];

      // Encontra a próxima senha na fila que ainda não foi atendida
      const senha = fila.find((s: Senhas) => !s.statusAtendimento);

      if (senha) {
        // Define data e hora do atendimento
        senha.dataHoraAtendimento = formatDate(new Date(), 'dd-MM-yyyy HH:mm:ss', 'pt-BR', '3');
        senha.statusAtendimento = true; // Define status de atendimento como verdadeiro

        // Atualiza as contagens de senhas atendidas por tipo
        switch (senha.prioridade) {
          case Prioridades.SG:
            this.senhasAtendidasGeral++;
            break;
          case Prioridades.SP:
            this.senhasAtendidasPrior++;
            break;
          case Prioridades.SE:
            this.senhasAtendidasExame++;
            break;
          default:
            break;
        }

        // Atualiza a última senha chamada para o atendente correspondente
        this.ultimasSenhasChamadas[atendente] = senha.numeracaoSenha;

        // Atualiza a fila
        localStorage.setItem("fila", JSON.stringify(fila));

        // Atualiza a disponibilidade de senhas
        this.senhasDisponiveis = this.verificarSenhasDisponiveis();
      } else {
        console.log("Todas as senhas foram atendidas.");
      }
    } else {
      console.log("Não há mais senhas disponíveis para atendimento.");
    }
  }

  public ultimasSenhasAtendidas(): Senhas[] {
    let item = localStorage.getItem("fila");
    let filaRecuperada = item ? JSON.parse(item) : [];
    let filaUltimosAtendidos: Senhas[] = [];

    for (let i = filaRecuperada.length - 1; i >= 0; i--) {
      if (filaRecuperada[i].statusAtendimento) {
        filaUltimosAtendidos.push(filaRecuperada[i]);
      }

      if (filaUltimosAtendidos.length >= 5) {
        break;
      }
    }

    return filaUltimosAtendidos.reverse();
  }

  public mostrarSenha(): string {
    if (this.ultSenha === "SG") {
      return "SG" + this.senhasGeral.toLocaleString('pt-br', { minimumIntegerDigits: 3 });
    } else if (this.ultSenha === "SP") {
      return "SP" + this.senhasPrior.toLocaleString('pt-br', { minimumIntegerDigits: 3 });
    } else {
      return "SE" + this.senhasExame.toLocaleString('pt-br', { minimumIntegerDigits: 3 });
    }
  }

  private somaGeral(): void {
    this.senhasGeral++;
    this.senhasTotal++;
  }

  private somaPrior(): void {
    this.senhasPrior++;
    this.senhasTotal++;
  }

  private somaExame(): void {
    this.senhasExame++;
    this.senhasTotal++;
  }

  private criarSenha(prioridade: Prioridades): Senhas {
    let numeracao = 0;
    switch (prioridade) {
      case Prioridades.SG:
        numeracao = this.senhasGeral;
        break;
      case Prioridades.SP:
        numeracao = this.senhasPrior;
        break;
      case Prioridades.SE:
        numeracao = this.senhasExame;
        break;
      default:
        break;
    }
    numeracao++; // Incrementa a numeração
    const senha: Senhas = {
      numeracaoSenha: numeracao.toString(),
      prioridade: prioridade,
      statusAtendimento: false,
      dataHoraEmissao: formatDate(new Date(), 'dd-MM-yyyy HH:mm:ss', 'pt-BR', '3'),
      dataHoraAtendimento: '',
      sequencial: '',
      guiche: 0
    };
    this.salvarSenhaNoLocalStorage(prioridade, numeracao.toString());
    return senha;
}


  private salvarSenhaNoLocalStorage(chave: string, ultSenha: string): void {
    localStorage.setItem(chave, ultSenha);
    localStorage.setItem('ultimaGerada', ultSenha);
    this.senhasGeradas.push(ultSenha);
    localStorage.setItem('senhasGeradas', JSON.stringify(this.senhasGeradas));
    this.atualizarSenhasGeradas(this.senhasGeradas);
  }

  public senhasGeradasSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  public atualizarSenhasGeradas(senhas: string[]): void {
    this.senhasGeradas = senhas;
    this.senhasGeradasSubject.next(senhas);
  }

  private verificarHorario(): boolean {
    // Verifica se está no horário de atendimento (das 07:00 às 16:45)
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    return hour >= 7 && (hour < 16 || (hour === 16 && minute <= 45));
  }

}
