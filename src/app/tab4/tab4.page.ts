import { Component } from '@angular/core';
import { SenhasService } from '../services/senhas.service';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {

  ultimaChamda: string = '';

  constructor(public senhasService: SenhasService) {}

  carregarSenhasSalvas() {
    this.ultimaChamda =  localStorage.getItem('ultimaChamda') || 'Sistema iniciando...';
  }

}
