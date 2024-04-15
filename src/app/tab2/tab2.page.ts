// tab2.page.ts

import { Component } from '@angular/core';
import { SenhasService } from '../services/senhas.service';
import { Senhas } from '../models/senhas';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  senhaEmAtendimento: Senhas | null = null;
  senhaAtendida: any;

  constructor(public senhasService: SenhasService) { }

  atenderOuConfirmar(atendente: string) {
    if (this.senhaEmAtendimento !== null && this.senhaEmAtendimento.guiche === this.senhasService.atendente[atendente]) {
      this.confirmarAtendimento(atendente); // Chama a função confirmarAtendimento passando o atendente
    } else {
      this.atenderSenha(atendente);
    }
  }

  atenderSenha(atendente: string) {
    const senhaAtendida = this.senhasService.atenderSenha(atendente);
    if (senhaAtendida) {
      this.senhaEmAtendimento = senhaAtendida;
      console.log("Senha em atendimento:", senhaAtendida);
      // Verifica se this.senhaEmAtendimento não é nulo antes de acessar suas propriedades
      if (this.senhaEmAtendimento) {
        this.senhaEmAtendimento.statusAtendimento = false;
      }
    } else {
      console.log("Não há senha disponível para", atendente);
    }
  }
  
  confirmarAtendimento(atendente: string) {
    if (this.senhaEmAtendimento) {
      this.senhasService.confirmarAtendimento(this.senhaEmAtendimento, atendente);
      console.log("Atendimento confirmado para:", atendente);
      // Verifica se this.senhaEmAtendimento não é nulo antes de acessar suas propriedades
      if (this.senhaEmAtendimento) {
        this.senhaEmAtendimento.statusAtendimento = true;
        console.log("Senha atendida:", this.senhaEmAtendimento);
      }
    } else {
      console.log("Não há atendimento para confirmar.");
    }
  }
  
  

  isAtendendo(atendente: string): boolean {
    return this.senhaEmAtendimento !== null && this.senhaEmAtendimento.guiche === this.senhasService.atendente[atendente];
  }

  getAtendentesKeys(): string[] {
    return Object.keys(this.senhasService.atendente);
  }
}
