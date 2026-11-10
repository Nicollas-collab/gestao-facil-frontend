import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ItemServicos } from '../../servicos/item.servicos';
import { Item } from '../../models/item';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly itemService = inject(ItemServicos);
  private readonly cdr = inject(ChangeDetectorRef);

  produtos: Item[] = [];
  servicos: Item[] = [];

  carregando = false;
  erro = '';

  ngOnInit(): void {
    this.carregarItens();
  }

  carregarItens(): void {
    this.carregando = true;
    this.erro = '';

    this.itemService.listarItens().subscribe({
      next: (resposta) => {
        const itensAtivos = resposta.filter((item) => item.ativoProdutoServico === 'S');

        // Produtos disponíveis na loja
        this.produtos = itensAtivos.filter((item) => item.tipoItem === 'P').slice(0, 4);

        // Serviços disponíveis na loja
        this.servicos = itensAtivos.filter((item) => item.tipoItem === 'S').slice(0, 4);

        this.carregando = false;

        this.cdr.detectChanges();
      },

      error: (erro) => {
        console.error('Erro ao carregar itens da Home:', erro);

        this.erro = 'Não foi possível carregar os produtos e serviços.';

        this.carregando = false;

        this.cdr.detectChanges();
      },
    });
  }
}
