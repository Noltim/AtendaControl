// tab2.page.ts

import { Component } from '@angular/core';
import { SenhasService } from '../services/senhas.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  senhaEmAtendimento: string | null = null;
  senhaAtendida: any = null;
  atendimentoConfirmado: boolean = false;

  constructor(public senhasService: SenhasService) { }

  atenderOuConfirmar(atendente: string) {
    if (this.senhaEmAtendimento !== null && this.senhaEmAtendimento === atendente) {
      this.confirmarAtendimento();
    } else {
      this.atenderSenha(atendente);
    }
  }

  atenderSenha(atendente: string) {
    const senhaAtendida = this.senhasService.atenderSenha(atendente);
    if (senhaAtendida) {
      this.senhaEmAtendimento = atendente;
      this.senhaAtendida = senhaAtendida;
      console.log("Senha gerada em atendimento:", senhaAtendida);
      this.atendimentoConfirmado = false; // Reseta a confirmação do atendimento
    } else {
      console.log("Não há senha disponível para", atendente);
    }
  }

  confirmarAtendimento() {
    if (this.senhaEmAtendimento && !this.atendimentoConfirmado) {
      // Adicione aqui a lógica para confirmar o atendimento
      console.log("Atendimento confirmado para:", this.senhaEmAtendimento);
      this.senhaAtendida.statusAtendimento = 'Senha atendida'; // Altera o status para 'Senha atendida'
      console.log("Senha atendida:", this.senhaAtendida);
      this.atendimentoConfirmado = true; // Marca o atendimento como confirmado
    } else {
      console.log("Não há atendimento para confirmar ou já foi confirmado.");
    }
  }

  isAtendendo(atendente: string): boolean {
    return this.senhaEmAtendimento !== null && this.senhaEmAtendimento === atendente;
  }

  getAtendentesKeys(): string[] {
    return Object.keys(this.senhasService.atendente);
  }
}
