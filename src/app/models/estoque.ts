export interface Estoque {
  iditem: number;
  nomeItem: string;
  unidade: string;
  quantidadeEstoque: number;
}

export interface EstoqueAtualizarDTO {
  quantidadeEstoque: number;
}
