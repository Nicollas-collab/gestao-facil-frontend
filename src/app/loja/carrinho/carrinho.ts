import { Component, OnInit, inject, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { CarrinhoService, CarrinhoItem } from '../../servicos/carrinho.service';
import { Item } from '../../models/item';
import { PedidoService, PedidoCriarDTO } from '../../servicos/pedido.service';
import { environment } from '../../../environments/environments';

interface EstoqueCarrinho {
  iditem: number;
  quantidadeEstoque: number;
}

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css',
})
export class Carrinho implements OnInit {
  private readonly carrinhoService = inject(CarrinhoService);
  private readonly pedidoService = inject(PedidoService);
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);

  itens: CarrinhoItem[] = [];
  estoques: EstoqueCarrinho[] = [];

  total = 0;
  mensagem = '';
  erro = '';
  erroEstoque = false;
  finalizando = false;
  carregandoEstoque = true;

  ngOnInit(): void {
    this.atualizarCarrinho();
    this.carregarEstoque();
  }

  atualizarCarrinho(): void {
    this.itens = this.carrinhoService.obterItens();
    this.total = this.carrinhoService.calcularTotal();
  }

  carregarEstoque(): void {
    this.carregandoEstoque = true;

    this.http.get<EstoqueCarrinho[]>(`${environment.apiUrl}/api/Estoque`).subscribe({
      next: (dados) => {
        this.estoques = dados;
        this.carregandoEstoque = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao consultar estoque:', erro);

        this.estoques = [];
        this.carregandoEstoque = false;
        this.erro = 'Não foi possível consultar o estoque. Tente atualizar a página.';

        this.cdr.detectChanges();
      },
    });
  }

  quantidadeDisponivel(item: Item): number {
    if (item.tipoItem !== 'P') {
      return 0;
    }

    const estoque = this.estoques.find((e) => e.iditem === item.iditem);

    return estoque?.quantidadeEstoque ?? 0;
  }

  limiteAtingido(entrada: CarrinhoItem): boolean {
    if (entrada.item.tipoItem !== 'P') {
      return false;
    }

    return entrada.quantidade >= this.quantidadeDisponivel(entrada.item);
  }

  aumentar(item: Item): void {
    this.limparMensagens();

    if (this.finalizando || this.carregandoEstoque) {
      return;
    }

    if (item.tipoItem === 'P') {
      const disponivel = this.quantidadeDisponivel(item);

      const quantidadeAtual =
        this.itens.find((i) => i.item.iditem === item.iditem)?.quantidade ?? 0;

      if (quantidadeAtual >= disponivel) {
        this.erroEstoque = true;
        this.erro =
          `Estoque insuficiente para ${item.item1}. ` + `Disponível: ${disponivel} unidade(s).`;
        return;
      }
    }

    this.carrinhoService.adicionar(item);
    this.atualizarCarrinho();
  }

  diminuir(item: Item): void {
    if (this.finalizando) return;

    this.limparMensagens();
    this.carrinhoService.diminuir(item);
    this.atualizarCarrinho();
  }

  remover(item: Item): void {
    if (this.finalizando) return;

    this.limparMensagens();
    this.carrinhoService.remover(item);
    this.atualizarCarrinho();
  }

  limpar(): void {
    if (this.finalizando) return;

    this.limparMensagens();
    this.carrinhoService.limpar();
    this.atualizarCarrinho();
  }

  limparMensagens(): void {
    this.mensagem = '';
    this.erro = '';
    this.erroEstoque = false;
  }

  finalizarCompra(): void {
    if (this.finalizando) {
      return;
    }

    this.limparMensagens();

    if (this.itens.length === 0) {
      this.erro = 'Seu carrinho está vazio.';
      return;
    }

    if (!isPlatformBrowser(this.platformId)) {
      this.erro = 'Aguarde o carregamento da página.';
      return;
    }

    const idPessoa = Number(localStorage.getItem('idPessoa'));

    if (!Number.isInteger(idPessoa) || idPessoa <= 0) {
      this.erro = 'Você precisa realizar o cadastro antes de finalizar a compra.';
      return;
    }

    if (this.itens.some((i) => !i.item.iditem || i.quantidade <= 0)) {
      this.erro = 'Existem itens inválidos no carrinho.';
      return;
    }

    this.finalizando = true;

    // Atualiza o estoque antes de enviar o pedido
    this.http.get<EstoqueCarrinho[]>(`${environment.apiUrl}/api/Estoque`).subscribe({
      next: (dados) => {
        this.estoques = dados;
        this.carregandoEstoque = false;

        // Verifica todos os produtos do carrinho
        const produtoSemEstoque = this.itens.find((entrada) => {
          if (entrada.item.tipoItem !== 'P') {
            return false;
          }

          return entrada.quantidade > this.quantidadeDisponivel(entrada.item);
        });

        if (produtoSemEstoque) {
          const disponivel = this.quantidadeDisponivel(produtoSemEstoque.item);

          this.erroEstoque = true;
          this.erro =
            `Estoque insuficiente para ${produtoSemEstoque.item.item1}. ` +
            `Disponível: ${disponivel} unidade(s). ` +
            `Solicitado: ${produtoSemEstoque.quantidade}.`;

          this.finalizando = false;
          this.cdr.detectChanges();
          return;
        }

        const pedido: PedidoCriarDTO = {
          idPessoa: idPessoa,
          itens: this.itens.map((i) => ({
            idItem: i.item.iditem!,
            quantidade: i.quantidade,
          })),
        };

        this.pedidoService.cadastrarPedido(pedido).subscribe({
          next: (resposta) => {
            this.finalizando = false;

            this.carrinhoService.limpar();
            this.atualizarCarrinho();

            this.mensagem = `Pedido realizado com sucesso! Número: ${resposta.idpedido}`;

            this.erro = '';
            this.erroEstoque = false;

            this.cdr.detectChanges();
          },

          error: (erro) => {
            this.finalizando = false;

            console.error('Erro ao finalizar compra:', erro);

            if (erro.status === 409) {
              this.erroEstoque = true;
              this.erro = erro.error?.mensagem || 'Estoque insuficiente para finalizar a compra.';
            } else if (erro.status === 400) {
              this.erro = erro.error?.mensagem || 'Verifique os itens do seu carrinho.';
            } else if (erro.status === 0) {
              this.erro = 'Não foi possível conectar ao servidor.';
            } else {
              this.erro = erro.error?.mensagem || 'Não foi possível finalizar a compra.';
            }

            // Atualiza o estoque após uma falha
            if (erro.status === 409) {
              this.carregarEstoque();
            }

            this.cdr.detectChanges();
          },
        });
      },

      error: (erro) => {
        console.error('Erro ao atualizar estoque:', erro);

        this.finalizando = false;
        this.erro = 'Não foi possível verificar o estoque. Tente novamente.';

        this.cdr.detectChanges();
      },
    });
  }
}
