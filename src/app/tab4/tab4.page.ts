import {Component, OnInit} from '@angular/core';
import {SenhasService} from '../services/senhas.service';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page{

  ultimasSenhas: string = '';

  constructor(public senhasService: SenhasService) {
  }
}
