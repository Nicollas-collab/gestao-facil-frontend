
export interface Item {
  iditem?: number;
  idcategoria: number;
  categoria?: string;
  item1: string;
  descricaoItem: string;
  preco: number;
  tipoItem: string;
  ativoProdutoServico: string;
}

export interface ItemCriarDTO {
  idcategoria: number;
  item1: string;
  descricaoItem: string;
  preco: number;
  tipoItem: string;
  ativoProdutoServico: string;
}
