import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { CarrinhoService } from '../../servicos/carrinho.service';
import { ItemServicos } from '../../servicos/item.servicos';
import { Item } from '../../models/item';
import { environment } from '../../../environments/environments';

interface EstoqueCatalogo {
  iditem: number;
  quantidadeEstoque: number;
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo implements OnInit {
  private readonly itemService = inject(ItemServicos);
  private readonly carrinhoService = inject(CarrinhoService);
  readonly quantidadeCarrinho$ = this.carrinhoService.quantidade$;
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);

  itens: Item[] = [];
  estoques: EstoqueCatalogo[] = [];

  carregando = false;
  erro = '';
  mensagemCarrinho = '';

  ngOnInit(): void {
    this.carregarItens();
  }

  carregarItens(): void {
    this.carregando = true;
    this.erro = '';

    forkJoin({
      itens: this.itemService.listarItens(),
      estoques: this.http.get<EstoqueCatalogo[]>(`${environment.apiUrl}/api/Estoque`),
    }).subscribe({
      next: ({ itens, estoques }) => {
        this.itens = itens.filter((item) => item.ativoProdutoServico === 'S');

        this.estoques = estoques;
        this.carregando = false;

        this.cdr.detectChanges();
      },

      error: (erro) => {
        console.error('Erro ao carregar catálogo:', erro);

        this.erro = 'Não foi possível carregar os produtos, serviços ou estoque.';

        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }

  nomeTipo(tipo: string): string {
    return tipo === 'P' ? 'Produto' : 'Serviço';
  }

  quantidadeDisponivel(item: Item): number {
    // Serviços não possuem controle de estoque
    if (item.tipoItem !== 'P') {
      return 0;
    }

    const estoque = this.estoques.find((e) => e.iditem === item.iditem);

    return estoque?.quantidadeEstoque ?? 0;
  }

  produtoEsgotado(item: Item): boolean {
    return item.tipoItem === 'P' && this.quantidadeDisponivel(item) <= 0;
  }

  adicionarAoCarrinho(item: Item): void {
    this.mensagemCarrinho = '';

    if (this.produtoEsgotado(item)) {
      this.mensagemCarrinho = `O produto ${item.item1} está esgotado.`;

      return;
    }

    // Impede adicionar mais unidades do que há no estoque
    if (item.tipoItem === 'P') {
      const quantidadeNoCarrinho =
        this.carrinhoService.obterItens().find((i) => i.item.iditem === item.iditem)?.quantidade ??
        0;

      const quantidadeDisponivel = this.quantidadeDisponivel(item);

      if (quantidadeNoCarrinho >= quantidadeDisponivel) {
        this.mensagemCarrinho =
          `Estoque insuficiente para ${item.item1}. ` +
          `Disponível: ${quantidadeDisponivel} unidade(s).`;

        return;
      }
    }

    const resultado = this.carrinhoService.adicionar(item);

    if (resultado) {
      this.mensagemCarrinho = `${item.item1} adicionado ao carrinho!`;
    } else {
      this.mensagemCarrinho = 'Não foi possível adicionar esse item.';
    }
  }
}
