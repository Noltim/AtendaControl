import { Injectable } from '@angular/core';
import { Senhas } from "../models/senhas";
import { Prioridades } from "../models/prioridades";
import { formatDate } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SenhasService {

  atendente: { [key: string]: number } = {
    "Dielder Gabriel Arruda Leal": 1,
    "Jailton Inácio dos Santos Junior": 2,
    "José Milton de Oliveira Neto": 3,
    "Lucas Crespo Rodrigues": 4,
    "Leonardo Emanuel Souza dos Santos": 5
  };

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
  private senhasDisponiveisSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public senhasDisponiveis$: Observable<boolean> = this.senhasDisponiveisSubject.asObservable();

  constructor() {
    this.senhasDisponiveis = this.verificarSenhasDisponiveis();
  }


  private verificarSenhasDisponiveis(): boolean {
    // Verifica se há senhas na fila não atendidas
    let filaString = localStorage.getItem("fila");
    let fila = filaString ? JSON.parse(filaString) : [];
    return fila.some((senha: Senhas) => !senha.statusAtendimento);
  }

  gerarSenha(prioridade: string) {
    console.log("Iniciando geração de senha...");
    
    let filaString = localStorage.getItem("fila");
    let fila = filaString ? JSON.parse(filaString) : [];
  
    if (this.verificarHorario()) {
      switch (prioridade) {
        case "SG": {
          console.log("Gerando senha prioritária SG...");
          this.somaGeral();
          this.ultSenha = "SG";
          const senha = this.criarSenha(Prioridades.SG);
          fila.push(senha);
          console.log("Senha gerada:", senha);
          localStorage.setItem("fila", JSON.stringify(fila));
          this.salvarSenhaNoLocalStorage('senhaGeral', senha.numeracaoSenha);
          break;
        }
  
        case "SP": {
          console.log("Gerando senha prioritária SP...");
          this.somaPrior();
          this.ultSenha = "SP";
          const senha = this.criarSenha(Prioridades.SP);
          fila.push(senha);
          console.log("Senha gerada:", senha);
          localStorage.setItem("fila", JSON.stringify(fila));
          this.salvarSenhaNoLocalStorage('senhaPrioritaria', senha.numeracaoSenha);
          break;
        }
  
        case "SE": {
          console.log("Gerando senha prioritária SE...");
          this.somaExame();
          this.ultSenha = "SE";
          const senha = this.criarSenha(Prioridades.SE);
          fila.push(senha);
          console.log("Senha gerada:", senha);
          localStorage.setItem("fila", JSON.stringify(fila));
          console.log(this.salvarSenhaNoLocalStorage('senhaExame', senha.numeracaoSenha));
          break;
        }
      }
    } else {
      console.log("Fora do horário de atendimento para geração de senhas.");
      alert("As senhas só podem ser geradas das 07:00 até às 16:45");
    }
  }
  
  atenderSenha(atendente: string) {
    let filaString = localStorage.getItem("fila");
    let fila = filaString ? JSON.parse(filaString) : [];
  
    // Verifica se há senhas na fila
    if (fila.length > 0) {
      // Itera sobre cada senha na fila até encontrar uma que ainda não foi atendida
      for (let i = 0; i < fila.length; i++) {
        let senha = fila[i];
        if (!senha.statusAtendimento) { // Verifica se a senha não foi atendida
          senha.dataHoraAtendimento = formatDate(new Date(), 'dd-MM-yyyy HH:mm:ss', 'pt-BR', '3'); // Define data e hora do atendimento
          senha.statusAtendimento = true; // Define status de atendimento como verdadeiro
          senha.guiche = this.atendente[atendente]; // Atribui o guichê correspondente ao atendente
  
          // Atualizar as contagens de senhas atendidas por tipo
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
  
          // Atualizar a última senha chamada para o atendente correspondente
          this.ultimasSenhasChamadas[atendente] = senha.numeracaoSenha;
  
          this.senhasAtendidasTotal++; // Atualizar o total de senhas atendidas
  
          localStorage.setItem("fila", JSON.stringify(fila)); // Atualizar a fila no armazenamento local
          return senha; // Retornar a senha atendida
        }
      }
    }
  
    return null; // Se não houver senhas na fila ou todas foram atendidas, retornar null
  }


  
  
  

  ultimasSenhasAtendidas(): Senhas[] {
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

  mostrarSenha(): string {
    return this.ultSenha + this.senhasTotal.toLocaleString('pt-br', { minimumIntegerDigits: 3 });
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
    const senha = new Senhas();
    senha.dataHoraEmissao = formatDate(new Date(), 'dd-MM-yyyy HH:mm:ss', 'pt-BR', '3');
    senha.prioridade = prioridade;
    senha.sequencial = this.obterSequencial(prioridade).toLocaleString('pt-br', { minimumIntegerDigits: 3 });
    senha.numeracaoSenha =
      new Date().getFullYear().toString().slice(-2) +
      (new Date().getMonth() + 1).toString().padStart(2, '0') +
      new Date().getDate().toString().padStart(2, '0') +
      this.ultSenha +
      senha.sequencial;
    return senha;
  }

  private obterSequencial(prioridade: Prioridades): number {
    switch (prioridade) {
      case Prioridades.SG:
        return this.senhasGeral;
      case Prioridades.SP:
        return this.senhasPrior;
      case Prioridades.SE:
        return this.senhasExame;
      default:
        return 0;
    }
  }

  private salvarSenhaNoLocalStorage(chave: string, ultSenha: string) {
    localStorage.setItem(chave, ultSenha);
    localStorage.setItem('ultimaGerada', ultSenha);
    this.senhasGeradas.push(ultSenha);
    localStorage.setItem('senhasGeradas', JSON.stringify(this.senhasGeradas));
    this.atualizarSenhasGeradas(this.senhasGeradas);
  }

  public senhasGeradasSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  atualizarSenhasGeradas(senhas: string[]) {
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
