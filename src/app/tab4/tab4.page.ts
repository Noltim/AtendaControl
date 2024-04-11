import { Component, OnInit } from '@angular/core';
import { SenhasService } from '../services/senhas.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page implements OnInit {
  ultimasSenhas: string[] = [];
  senhasSubscription: Subscription = new Subscription();

  constructor(public senhasService: SenhasService) {}

  ngOnInit() {
    // Subscrever ao BehaviorSubject para receber atualizações
    this.senhasSubscription = this.senhasService.senhasGeradasSubject.subscribe((senhas: string[]) => {
      // Atualizar a variável ultimasSenhas com as novas senhas geradas
      this.ultimasSenhas = senhas.slice(-5).reverse(); // Exibir as últimas 5 senhas
    });
  }

  ngOnDestroy() {
    // Cancelar a inscrição para evitar vazamentos de memória
    this.senhasSubscription.unsubscribe();
  }
}
