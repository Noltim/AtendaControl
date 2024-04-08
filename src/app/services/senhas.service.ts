import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SenhasService {
  public senhasGeral: number = localStorage.getItem('senhaGeral') !== null ? parseInt(localStorage.getItem('senhaGeral')!) : 0;
  public senhasPrior: number = localStorage.getItem('senhaPrioritaria') !== null ? parseInt(localStorage.getItem('senhaPrioritaria')!) : 0;
  public senhasExame: number = localStorage.getItem('senhaExame') !== null ? parseInt(localStorage.getItem('senhaExame')!) : 0;
  public ultimaChamada: string = localStorage.getItem('ultimaChamada') !== null ? localStorage.getItem('ultimaChamada')! : '';
  public senhasTotal: number = this.senhasGeral + this.senhasPrior + this.senhasExame;
  public ultSenha: string = 'N';

  constructor() {
  }

  gerarSenhaGeral() {
    this.somaGeral();
    this.ultSenha = 'N';
    this.salvarSenhaNoLocalStorage('senhaGeral', this.senhasGeral, this.ultSenha);
  }

  gerarSenhaPrior() {
    this.somaPrior();
    this.ultSenha = 'P';
    this.salvarSenhaNoLocalStorage('senhaPrioritaria', this.senhasPrior, this.ultSenha);
  }

  gerarSenhaExame() {
    this.somaExame();
    this.ultSenha = 'E';
    this.salvarSenhaNoLocalStorage('senhaExame', this.senhasExame, this.ultSenha);
  }

  listarItensLocalStorage() {
    const keys = Object.keys(localStorage);

    keys.sort();

    const listaOrdenada = document.createElement('ol');

    keys.forEach(key => {
      const valor = localStorage.getItem(key);
      const itemLista = document.createElement('li');
      itemLista.textContent = `${key}: ${valor}`;
      listaOrdenada.appendChild(itemLista);
    });

    const container = document.querySelector('#lista-container');

    // @ts-ignore
    container.innerHTML = '';

    // @ts-ignore
    container.appendChild(listaOrdenada);
  }

  mostrarSenha() {
    if (this.ultSenha === 'N') {
      return 'N' + this.senhasGeral.toLocaleString('pt-br', {minimumIntegerDigits: 3});
    } else if (this.ultSenha === 'P') {
      return 'P' + this.senhasPrior.toLocaleString('pt-br', {minimumIntegerDigits: 3});
    } else {
      return 'E' + this.senhasExame.toLocaleString('pt-br', {minimumIntegerDigits: 3});
    }
  }

  private somaGeral() {
    this.senhasGeral++;
    this.senhasTotal++;
  }

  private somaPrior() {
    this.senhasPrior++;
    this.senhasTotal++;
  }

  private somaExame() {
    this.senhasExame++;
    this.senhasTotal++;
  }

  private salvarSenhaNoLocalStorage(chave: string, valor: number, ultSenha: string) {
    localStorage.setItem(chave, valor.toString())
    localStorage.setItem('ultimaChamada', ultSenha + valor.toLocaleString('pt-br', {minimumIntegerDigits: 3}))
  }
}


