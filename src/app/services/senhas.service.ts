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

  private proximaPrioridade: Prioridades = Prioridades.SP; // Inicia com SP como próxima prioridade
  // Variáveis para contar as senhas atendidas por tipo
  public senhasGeral: number = localStorage.getItem('senhaGeral')
    ? parseInt(localStorage.getItem('senhaGeral')!.slice(-3))
    : 0;
  public senhasPrior: number = localStorage.getItem('senhaPrioritaria')
    ? parseInt(localStorage.getItem('senhaPrioritaria')!.slice(-3))
    : 0;
  public senhasExame: number = localStorage.getItem('senhaExame')
    ? parseInt(localStorage.getItem('senhaExame')!.slice(-3))
    : 0;
  public atendidosStorage: Senhas[] = localStorage.getItem('Atendidos') !== null ? JSON.parse(localStorage.getItem('Atendidos')!)
    : [];
  public listAtendidos: string[] = localStorage.getItem('listAtendidos') !== null ? JSON.parse(localStorage.getItem('listAtendidos')!)
    : [];

  public ultimaGerada: string =
    localStorage.getItem('ultimaGerada') !== null
      ? localStorage.getItem('ultimaGerada')!
      : '';
  public senhasTotal: number =
    this.senhasGeral + this.senhasPrior + this.senhasExame;
  public ultSenha: string = 'SG';
  public senhasGeradas: string[] =
    localStorage.getItem('senhasGeradas') !== null
      ? JSON.parse(localStorage.getItem('senhasGeradas')!)
      : [];

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

  confirmarAtendimento(senha: Senhas, atendente: string) { // Modificação do método para aceitar um objeto Senhas e uma string de atendente
    let filaString = localStorage.getItem("fila");
    let fila = filaString ? JSON.parse(filaString) : [];

    for (let i = 0; i < fila.length; i++) {
      if (fila[i].numeracaoSenha === senha.numeracaoSenha) { // Verifica se a senha na fila corresponde à senha a ser confirmada
        // Lógica para confirmar o atendimento
        // Por exemplo:
        fila[i].statusAtendimento = true;
        fila[i].dataHoraAtendimento = formatDate(new Date(), 'dd-MM-yyyy HH:mm:ss', 'pt-BR', '3');
        fila[i].guiche = this.atendente[atendente]; // Define o guichê para o atendente
        localStorage.setItem("fila", JSON.stringify(fila)); // Atualiza a fila no armazenamento local
        return;
      }
    }
  }


  gerarSenha(prioridade: string) {
    let filaString = localStorage.getItem('fila');
    let fila = filaString ? JSON.parse(filaString) : [];

    if (this.verificarHorario()) {
      switch (prioridade) {
        case 'SG': {
          this.somaGeral();
          this.ultSenha = 'SG';
          const senha = new Senhas();
          senha.dataHoraEmissao = formatDate(
            new Date(),
            'dd-MM-yyyy HH:mm:ss',
            'pt-BR',
            '3'
          );
          senha.prioridade = Prioridades.SG;
          senha.sequencial = this.senhasGeral.toLocaleString('pt-br', {
            minimumIntegerDigits: 3,
          });
          senha.numeracaoSenha =
            new Date().getFullYear().toString().slice(-2) +
            (new Date().getMonth() + 1).toString().padStart(2, '0') +
            new Date().getDate().toString().padStart(2, '0') +
            this.ultSenha +
            senha.sequencial;
          fila.push(senha);
          localStorage.setItem('fila', JSON.stringify(fila));
          this.salvarSenhaNoLocalStorage('senhaGeral', senha.numeracaoSenha);
          break;
        }

        case 'SP': {
          this.somaPrior();
          this.ultSenha = 'SP';
          const senha = new Senhas();
          senha.dataHoraEmissao = formatDate(
            new Date(),
            'dd-MM-yyyy HH:mm:ss',
            'pt-BR',
            '3'
          );
          senha.prioridade = Prioridades.SP;
          senha.sequencial = this.senhasPrior.toLocaleString('pt-br', {
            minimumIntegerDigits: 3,
          });
          senha.numeracaoSenha =
            new Date().getFullYear().toString().slice(-2) +
            (new Date().getMonth() + 1).toString().padStart(2, '0') +
            new Date().getDate().toString().padStart(2, '0') +
            this.ultSenha +
            senha.sequencial;
          fila.push(senha);
          localStorage.setItem('fila', JSON.stringify(fila));
          this.salvarSenhaNoLocalStorage(
            'senhaPrioritaria',
            senha.numeracaoSenha
          );
          break;
        }

        case 'SE': {
          this.somaExame();
          this.ultSenha = 'SE';
          const senha = new Senhas();
          senha.dataHoraEmissao = formatDate(
            new Date(),
            'dd-MM-yyyy HH:mm:ss',
            'pt-BR',
            '3'
          );
          senha.prioridade = Prioridades.SE;
          senha.sequencial = this.senhasExame.toLocaleString('pt-br', {
            minimumIntegerDigits: 3,
          });
          senha.numeracaoSenha =
            new Date().getFullYear().toString().slice(-2) +
            (new Date().getMonth() + 1).toString().padStart(2, '0') +
            new Date().getDate().toString().padStart(2, '0') +
            this.ultSenha +
            senha.sequencial;
          fila.push(senha);
          localStorage.setItem('fila', JSON.stringify(fila));
          this.salvarSenhaNoLocalStorage('senhaExame', senha.numeracaoSenha);
          break;
        }
      }
    } else {
      alert('As senhas só podem ser geradas das 07:00 até às 16:45');
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

  atenderSenha(atendente: string) {
    let filaString = localStorage.getItem("fila");
    let fila = filaString ? JSON.parse(filaString) : [];
    let atendidosString = localStorage.getItem("Atendidos");
    let atendidos = atendidosString ? JSON.parse(atendidosString) : [];
    let listAtendidosStorege = localStorage.getItem("listAtendidos");
    let listStorege = listAtendidosStorege ? JSON.parse(listAtendidosStorege) : [];

    if (fila.length > 0) {
      let senhaPrioritaria = fila.find((senha: any) => !senha.statusAtendimento && senha.prioridade === Prioridades.SP);

      if (senhaPrioritaria) {
        senhaPrioritaria.dataHoraAtendimento = formatDate(new Date(), 'dd-MM-yyyy HH:mm:ss', 'pt-BR', '3');
        senhaPrioritaria.guiche = this.atendente[atendente];
        senhaPrioritaria.tempoAtendimento = calcularHora(senhaPrioritaria.dataHoraEmissao, senhaPrioritaria.dataHoraAtendimento);
        senhaPrioritaria.statusAtendimento = true;

        switch (senhaPrioritaria.prioridade) {
          case Prioridades.SP:
            this.senhasPrior++;
            break;
          case Prioridades.SG:
            this.senhasGeral++;
            break;
          case Prioridades.SE:
            this.senhasExame++;
            break;
          default:
            break;
        }

        this.ultimasSenhasChamadas[atendente] = senhaPrioritaria.numeracaoSenha;

        this.senhasTotal++;

        atendidos.push(senhaPrioritaria);
        this.atendidosStorage.push(senhaPrioritaria);

        listStorege.push(senhaPrioritaria.numeracaoSenha);
        this.listAtendidos.push(senhaPrioritaria.numeracaoSenha);

        localStorage.setItem("Atendidos", JSON.stringify(atendidos));
        localStorage.setItem("listAtendidos", JSON.stringify(listStorege));

        fila.splice(fila.indexOf(senhaPrioritaria), 1);
        localStorage.setItem("fila", JSON.stringify(fila));
        this.definirProximaPrioridade();

        return senhaPrioritaria;
      } else {
        let senhaNaoPrioritaria = fila.find((senha: any) => !senha.statusAtendimento && (senha.prioridade === Prioridades.SE || senha.prioridade === Prioridades.SG));

        if (senhaNaoPrioritaria) {
          senhaNaoPrioritaria.dataHoraAtendimento = formatDate(new Date(), 'dd-MM-yyyy HH:mm:ss', 'pt-BR', '3');
          senhaNaoPrioritaria.guiche = this.atendente[atendente];
          senhaNaoPrioritaria.tempoAtendimento = calcularHora(senhaNaoPrioritaria.dataHoraEmissao, senhaNaoPrioritaria.dataHoraAtendimento);
          senhaNaoPrioritaria.statusAtendimento = true;

          switch (senhaNaoPrioritaria.prioridade) {
            case Prioridades.SP:
              this.senhasPrior++;
              break;
            case Prioridades.SG:
              this.senhasGeral++;
              break;
            case Prioridades.SE:
              this.senhasExame++;
              break;
            default:
              break;
          }

          this.ultimasSenhasChamadas[atendente] = senhaNaoPrioritaria.numeracaoSenha;

          this.senhasTotal++;

          atendidos.push(senhaNaoPrioritaria);
          this.atendidosStorage.push(senhaNaoPrioritaria);

          listStorege.push(senhaNaoPrioritaria.numeracaoSenha);
          this.listAtendidos.push(senhaNaoPrioritaria.numeracaoSenha);

          localStorage.setItem("Atendidos", JSON.stringify(atendidos));
          localStorage.setItem("listAtendidos", JSON.stringify(listStorege));

          fila.splice(fila.indexOf(senhaNaoPrioritaria), 1);
          localStorage.setItem("fila", JSON.stringify(fila));
          this.definirProximaPrioridade();

          return senhaNaoPrioritaria;
        } else {
          return null;
        }
      }
    } else {
      return null;
    }
  }



  private definirProximaPrioridade() {
    if (this.proximaPrioridade === Prioridades.SP) {
      this.proximaPrioridade = Math.random() < 0.5 ? Prioridades.SG : Prioridades.SE; // Escolhe aleatoriamente entre SG e SE
    } else {
      this.proximaPrioridade = Prioridades.SP; // Retorna para SP
    }
  }




  ultimasSenhasAtendidas() {
    let item = localStorage.getItem('Atendidos');
    let filaRecuperada = item ? JSON.parse(item) : [];
    let filaUltimosAtendidos = [];

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
}

  function calcularHora(emissao: string, atendimento: string): string {
  const stringHoraEmissao = emissao.slice(8);
  const partesHoraEmissao = stringHoraEmissao.split(':');

  const horaEmissao = new Date();
  horaEmissao.setHours(parseInt(partesHoraEmissao[0], 10));
  horaEmissao.setMinutes(parseInt(partesHoraEmissao[1], 10));
  horaEmissao.setSeconds(parseInt(partesHoraEmissao[2], 10));

  const stringHoraAtendimento = atendimento.slice(8);
  const partesHoraAtendimento = stringHoraAtendimento.split(':');

  const horaAtendimento = new Date();
  horaAtendimento.setHours(parseInt(partesHoraAtendimento[0], 10));
  horaAtendimento.setMinutes(parseInt(partesHoraAtendimento[1], 10));
  horaAtendimento.setSeconds(parseInt(partesHoraAtendimento[2], 10));

  const diferencaMilissegundos = horaAtendimento.getTime() - horaEmissao.getTime();

  const horas = Math.floor(diferencaMilissegundos / (1000 * 60 * 60));
  const minutos = Math.floor((diferencaMilissegundos % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferencaMilissegundos % (1000 * 60)) / 1000);

  const diferencaFormatada = `${pad(horas)}:${pad(minutos)}:${pad(segundos)}`;

  return diferencaFormatada;
}

function pad(n: number): string {
  return n < 10 ? '0' + n : n.toString();

}
