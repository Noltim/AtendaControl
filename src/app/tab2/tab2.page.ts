import { Component } from '@angular/core';
import { SenhasService } from '../services/senhas.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public senhasService: SenhasService) { }

  atenderSenha(atendente: string) {
    // Chame a função de atender senha do serviço de senhas
    const senhaAtendida = this.senhasService.atenderSenha(atendente);

    // Faça algo com a senha atendida, se necessário
    console.log("Senha atendida:", senhaAtendida);

}
}