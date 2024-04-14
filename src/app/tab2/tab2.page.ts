import { Component } from '@angular/core';
import { SenhasService } from '../services/senhas.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  senhaEmAtendimento: string | null = null;
  atenderHabilitado: boolean = true;
  confirmarHabilitado: boolean = false;

  constructor(public senhasService: SenhasService) { }

  atenderOuConfirmar(atendente: string) {
    if (this.senhaEmAtendimento === atendente) {
      this.confirmarAtendimento();
    } else {
      this.atenderSenha(atendente);
    }
  }

  atenderSenha(atendente: string) {
    if (this.senhasService.senhasDisponiveis) {
      this.senhasService.atenderSenha(atendente);
      this.senhaEmAtendimento = atendente;
      this.atualizarEstadoBotoes();
      console.log("Atendimento iniciado para:", atendente);
    } else {
      console.log("Não há mais senhas disponíveis para atendimento.");
    }
  }

  confirmarAtendimento() {
    if (this.senhaEmAtendimento) {
      // Adicione aqui a lógica para confirmar o atendimento
      console.log("Atendimento confirmado para:", this.senhaEmAtendimento);
      this.senhaEmAtendimento = null; // Reinicializa a variável após confirmar o atendimento
      this.atualizarEstadoBotoes();
    } else {
      console.log("Não há atendimento para confirmar.");
    }
  }

  isAtendendo(atendente: string): boolean {
    return this.senhaEmAtendimento === atendente;
  }

  // Função para atualizar o estado dos botões com base na disponibilidade de senhas
  atualizarEstadoBotoes() {
    this.atenderHabilitado = !this.senhaEmAtendimento && this.senhasService.senhasDisponiveis;
    this.confirmarHabilitado = !!this.senhaEmAtendimento;
  }
}
