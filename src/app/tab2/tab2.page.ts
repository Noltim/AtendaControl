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

  constructor(public senhasService: SenhasService) { }

  atenderOuConfirmar(atendente: string) {
    if (this.senhaEmAtendimento !== null && this.senhaEmAtendimento.guiche === this.senhasService.atendente[atendente]) {
      this.continuarAtendimento(atendente); // Chama o método continuarAtendimento do serviço
    } else {
      this.atenderSenha(atendente); // Chama o método atenderSenha do serviço
    }
  }

  atenderSenha(atendente: string) {
    const senhaAtendida = this.senhasService.atenderSenha(atendente);
    if (senhaAtendida) {
      this.senhaEmAtendimento = senhaAtendida;
      console.log("Senha em atendimento:", senhaAtendida);
    } else {
      console.log("Não há senha disponível para", atendente);
    }
  }

  continuarAtendimento(atendente: string) {
    const senhaAtendida = this.senhasService.continuarAtendimento(atendente);
    if (senhaAtendida) {
      this.senhaEmAtendimento = senhaAtendida;
      console.log("Senha atendida:", senhaAtendida);
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
