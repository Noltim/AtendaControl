import { Senhas } from './../models/senhas';
import { Injectable } from '@angular/core';
import { Prioridades } from '../models/prioridades';
import { formatDate } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { BehaviorSubject, Observable } from 'rxjs';

registerLocaleData(localePt);

@Injectable({
  providedIn: 'root',
})
export class SenhasService {
  [x: string]: any;
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


  private proximaPrioridade: Prioridades = Prioridades.SP; // Inicia com SP como próxima prioridade

  // Variáveis para contar as senhas atendidas por tipo
  public senhasAtendidasTotal: number = 0;
  public senhasAtendidasGeral: number = 0;
  public senhasAtendidasPrior: number = 0;
  public senhasAtendidasExame: number = 0;


  private senhasDisponiveisSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public senhasDisponiveis$: Observable<boolean> = this.senhasDisponiveisSubject.asObservable();

  public ultimasSenhasChamadas: { [key: string]: string } = {}; // Variável para armazenar a última senha chamada por cada atendente

  atendente: { [key: string]: number } = {
    "Dielder Gabriel Arruda Leal": 1,
    "Jailton Inácio dos Santos Junior": 2,
    "José Milton de Oliveira Neto": 3,
    "Lucas Crespo Rodrigues": 4,
    "Leonardo Emanuel Souza dos Santos": 5
  };


  // TODO 3° Ao  chamar no guiche usar a seguinte logica : [SP] -> [SE|SG] -> [SP] -> [SE|SG]
  // TODO 4° Status do guiche: Em atendimento ou vazio.

  constructor() { }

  verificarHorario(): boolean {
    //DESCOMENTAR PARA ATIVAR VERIFICAÇÃO DE TEMPO ( REQUISITO)
    //return (new Date().getHours() >= 7 && (new Date().getHours() <= 16 || new Date().getMinutes() <= 45));
    return true;
  }



/*
  continuarAtendimento(senha: Senhas, atendente: string) { // Modificação do método para aceitar um objeto Senhas e uma string de atendente
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
*/
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


  atenderSenha(atendente: string) {
    let filaString = localStorage.getItem("fila");
    let fila = filaString ? JSON.parse(filaString) : [];
    let atendidosString = localStorage.getItem("Atendidos");
    let atendidos = atendidosString ? JSON.parse(atendidosString) : [];
    let listAtendidosStorege = localStorage.getItem("listAtendidos");
    let listStorege = listAtendidosStorege ? JSON.parse(listAtendidosStorege) : [];

    if (fila.length > 0) {
      for (let i = 0; i < fila.length; i++) {
        let senhaAtender = fila[i];
        let senhaPrioritaria = fila.find((senha: any) => !senha.statusAtendimento && senha.prioridade === Prioridades.SP);

        if (!senhaPrioritaria) {
          senhaAtender = fila.find((senha: any) => !senha.statusAtendimento && (senha.prioridade === Prioridades.SE || senha.prioridade === Prioridades.SG));
        } else {
          senhaAtender = senhaPrioritaria;
        }

        if (senhaAtender) {
          senhaAtender.dataHoraAtendimento = formatDate(new Date(), 'dd-MM-yyyy HH:mm:ss', 'pt-BR', '3');
          senhaAtender.guiche = this.atendente[atendente];
          senhaAtender.tempoAtendimento = calcularHora(senhaAtender.dataHoraEmissao, senhaAtender.dataHoraAtendimento);
          senhaAtender.statusAtendimento = false; // Definindo o status como false ao atender a senha

          switch (senhaAtender.prioridade) {
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

          this.ultimasSenhasChamadas[atendente] = senhaAtender.numeracaoSenha;

          this.senhasTotal++;

          atendidos.push(senhaAtender);
          this.atendidosStorage.push(senhaAtender);

          listStorege.push(senhaAtender.numeracaoSenha);
          this.listAtendidos.push(senhaAtender.numeracaoSenha);

          localStorage.setItem("Atendidos", JSON.stringify(atendidos));
          localStorage.setItem("listAtendidos", JSON.stringify(listStorege));

          fila.splice(fila.indexOf(senhaAtender), 1);
          localStorage.setItem("fila", JSON.stringify(fila));
          this.definirProximaPrioridade();

          return senhaAtender;
        }
      }
    }

    return null;
  }

  continuarAtendimento(atendente: string) {
    let filaString = localStorage.getItem("fila");
    let fila = filaString ? JSON.parse(filaString) : [];

    // Aqui você deve encontrar a senha que está sendo atendida pelo atendente atual
    let senhaEmAtendimento = fila.find((senha: any) => senha.guiche === this.atendente[atendente] && !senha.statusAtendimento);
    if (senhaEmAtendimento) {
      senhaEmAtendimento.statusAtendimento = true; // Definindo o status como true ao finalizar o atendimento

      localStorage.setItem("fila", JSON.stringify(fila));
      console.log("Atendimento confirmado para:", atendente);
      console.log("Senha atendida:", senhaEmAtendimento);

      return senhaEmAtendimento;
    } else {
      console.log("Não há atendimento para confirmar.");
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

  mostrarSenha() {
    if (this.ultSenha === 'SG') {
      return (
        'SG' +
        this.senhasGeral.toLocaleString('pt-br', { minimumIntegerDigits: 3 })
      );
    } else if (this.ultSenha === 'SP') {
      return (
        'SP' +
        this.senhasPrior.toLocaleString('pt-br', { minimumIntegerDigits: 3 })
      );
    } else {
      return (
        'SE' +
        this.senhasExame.toLocaleString('pt-br', { minimumIntegerDigits: 3 })
      );
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

  private salvarSenhaNoLocalStorage(chave: string, ultSenha: string) {
    localStorage.setItem(chave, ultSenha);
    localStorage.setItem('ultimaGerada', ultSenha);
    this.senhasGeradas.push(ultSenha);
    localStorage.setItem('senhasGeradas', JSON.stringify(this.senhasGeradas));
    this.atualizarSenhasGeradas(this.senhasGeradas);
  }

  public senhasGeradasSubject: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);

  atualizarSenhasGeradas(senhas: string[]) {
    this.senhasGeradas = senhas;
    this.senhasGeradasSubject.next(senhas);
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







