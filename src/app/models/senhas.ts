import {Prioridades} from "./prioridades";

export class Senhas {
  sequencial!: number;
  prioridade!: Prioridades;
  dataHoraEmissao!: string;
  dataHoraAtendimento!: string;
  statusAtendimento: boolean = false;
  guiche: number = 0;
}
