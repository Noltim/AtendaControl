import { Component, OnInit, OnDestroy } from '@angular/core';
import { SenhasService } from '../services/senhas.service';
import { Subscription } from 'rxjs';
import { Senhas } from '../models/senhas';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page implements OnInit, OnDestroy {
  ultimasSenhas: Senhas[] = [];
  senhasSubscription: Subscription = new Subscription();

  constructor(public senhasService: SenhasService) {}

  ngOnInit() {

    if (this.senhasService.atendidosStorage.length > 0) {
      this.ultimasSenhas = this.senhasService.atendidosStorage.slice(-5).reverse();
    } else {
      console.log("Não há itens na lista para exibir.");
    }
  }

  ngOnDestroy() {
    this.senhasSubscription.unsubscribe();
  }
}
