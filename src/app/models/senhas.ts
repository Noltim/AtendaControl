import {Prioridades} from "./prioridades";

export class Senhas {
  sequencial!: string;
  prioridade!: Prioridades;
  dataHoraEmissao!: string;
  dataHoraAtendimento!: string;
  statusAtendimento: boolean = false;
  guiche: number = 0;
  numeracaoSenha!: string;
  tempoAtendimento!: string;
  
}
