
import { Injectable, inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Item } from '../models/item';

export interface CarrinhoItem {
  item: Item;
  quantidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  private readonly platformId = inject(PLATFORM_ID);
  private readonly chave = 'gestao-facil-carrinho';

  private itensCarrinho: CarrinhoItem[] = this.carregar();

  private carregar(): CarrinhoItem[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }

    try {
      const dados = localStorage.getItem(this.chave);
      return dados ? JSON.parse(dados) : [];
    } catch {
      return [];
    }
  }

  private salvar(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      localStorage.setItem(
        this.chave,
        JSON.stringify(this.itensCarrinho)
      );
    } catch (erro) {
      console.error('Erro ao salvar carrinho:', erro);
    }
  }

  obterItens(): CarrinhoItem[] {
    return this.itensCarrinho.map(entrada => ({
      ...entrada,
      item: { ...entrada.item }
    }));
  }

  adicionar(item: Item): boolean {
    if (item.iditem == null) {
      return false;
    }

    const existente = this.itensCarrinho.find(
      entrada => entrada.item.iditem === item.iditem
    );

    if (existente) {
      existente.quantidade++;
    } else {
      this.itensCarrinho.push({
        item: item,
        quantidade: 1
      });
    }

    this.salvar();
    return true;
  }

  diminuir(item: Item): void {
    const existente = this.itensCarrinho.find(
      entrada => entrada.item.iditem === item.iditem
    );

    if (!existente) {
      return;
    }

    existente.quantidade--;

    if (existente.quantidade <= 0) {
      this.remover(item);
    } else {
      this.salvar();
    }
  }

  remover(item: Item): void {
    this.itensCarrinho = this.itensCarrinho.filter(
      entrada => entrada.item.iditem !== item.iditem
    );

    this.salvar();
  }

  limpar(): void {
    this.itensCarrinho = [];
    this.salvar();
  }

  calcularTotal(): number {
    return this.itensCarrinho.reduce(
      (total, entrada) =>
        total + entrada.item.preco * entrada.quantidade,
      0
    );
  }
}
