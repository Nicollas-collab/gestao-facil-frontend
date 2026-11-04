export interface Atendimento {
  idatendimento?: number;
  idpessoa: number;
  dataAtendimento: string;
  statusAtendimento: string;
  atendimentoitems?: AtendimentoItem[];
}

export interface AtendimentoItem {
  idatendimento: number;
  iditem: number;
  idfuncionario: number;
  quantidadeItens: number;
  valorunitarioEntrada: number;
}