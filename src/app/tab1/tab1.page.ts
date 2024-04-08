import {Component, OnInit} from '@angular/core';
import {SenhasService} from '../services/senhas.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {


  constructor(private senhasService: SenhasService) {
  }

  ngOnInit() {
    this.listarItensLocalStorage();
  }

  gerarSenhaGeral() {
    this.senhasService.gerarSenhaGeral();
  }

  gerarSenhaPrior() {
    this.senhasService.gerarSenhaPrior();
  }

  gerarSenhaExame() {
    this.senhasService.gerarSenhaExame();
  }

  listarItensLocalStorage() {
    this.senhasService.listarItensLocalStorage();
  }
}
