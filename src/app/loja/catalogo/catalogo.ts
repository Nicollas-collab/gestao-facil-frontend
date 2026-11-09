
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarrinhoService } from '../../servicos/carrinho.service';
import { ItemServicos } from '../../servicos/item.servicos';
import { Item } from '../../models/item';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class Catalogo implements OnInit {

  private readonly itemService = inject(ItemServicos);

  itens: Item[] = [];
  carregando = false;
  erro = '';

  ngOnInit(): void {
    this.carregarItens();
  }

  carregarItens(): void {
    this.carregando = true;
    this.erro = '';

    this.itemService.listarItens().subscribe({
      next: (dados) => {
        this.itens = dados.filter(
          item => item.ativoProdutoServico === 'S'
        );

        this.carregando = false;
      },
      error: (erro: any) => {
        console.error('Erro ao carregar catálogo:', erro);
        this.erro = 'Não foi possível carregar os produtos e serviços.';
        this.carregando = false;
      }
    });
  }

  nomeTipo(tipo: string): string {
    return tipo === 'P' ? 'Produto' : 'Serviço';
  }

  private readonly carrinhoService = inject(CarrinhoService);

mensagemCarrinho = '';

adicionarAoCarrinho(item: Item): void {
  const resultado = this.carrinhoService.adicionar(item);

  if (resultado) {
    this.mensagemCarrinho = `${item.item1} adicionado ao carrinho!`;
  } else {
    this.mensagemCarrinho = 'Não foi possível adicionar esse item.';
  }
}

}
