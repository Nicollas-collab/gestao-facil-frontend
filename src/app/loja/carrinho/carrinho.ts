
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  CarrinhoService,
  CarrinhoItem
} from '../../servicos/carrinho.service';

import { Item } from '../../models/item';

import {
  PedidoService,
  PedidoCriarDTO
} from '../../servicos/pedido.service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css'
})
export class Carrinho implements OnInit {

  private readonly carrinhoService = inject(CarrinhoService);
  private readonly pedidoService = inject(PedidoService);

  itens: CarrinhoItem[] = [];
  total = 0;

  mensagem = '';
  erro = '';
  finalizando = false;

  ngOnInit(): void {
    this.atualizarCarrinho();
  }

  atualizarCarrinho(): void {
    this.itens = this.carrinhoService.obterItens();
    this.total = this.carrinhoService.calcularTotal();
  }

  aumentar(item: Item): void {
    this.carrinhoService.adicionar(item);
    this.atualizarCarrinho();
  }

  diminuir(item: Item): void {
    this.carrinhoService.diminuir(item);
    this.atualizarCarrinho();
  }

  remover(item: Item): void {
    this.carrinhoService.remover(item);
    this.atualizarCarrinho();
  }

  limpar(): void {
    this.carrinhoService.limpar();
    this.atualizarCarrinho();
  }

  finalizarCompra(): void {
    this.mensagem = '';
    this.erro = '';

    if (this.finalizando) {
      return;
    }

    if (this.itens.length === 0) {
      this.erro = 'Seu carrinho está vazio.';
      return;
    }

    const idPessoa = Number(localStorage.getItem('idPessoa'));

    if (!Number.isInteger(idPessoa) || idPessoa <= 0) {
      this.erro =
        'Você precisa realizar o cadastro antes de finalizar a compra.';
      return;
    }

    if (this.itens.some(i => !i.item.iditem || i.quantidade <= 0)) {
      this.erro = 'Existem itens inválidos no carrinho.';
      return;
    }

    const pedido: PedidoCriarDTO = {
      idPessoa: idPessoa,
      itens: this.itens.map(i => ({
        idItem: i.item.iditem!,
        quantidade: i.quantidade
      }))
    };

    this.finalizando = true;

    this.pedidoService.cadastrarPedido(pedido).subscribe({
      next: (resposta) => {
        this.finalizando = false;

        this.carrinhoService.limpar();
        this.atualizarCarrinho();

        this.mensagem =
          `Pedido realizado com sucesso! Número: ${resposta.idpedido}`;
      },

      error: (erro) => {
        this.finalizando = false;

        console.error('Erro ao finalizar compra:', erro);

        this.erro =
          erro.error?.mensagem ||
          'Não foi possível finalizar a compra.';
      }
    });
  }
}
