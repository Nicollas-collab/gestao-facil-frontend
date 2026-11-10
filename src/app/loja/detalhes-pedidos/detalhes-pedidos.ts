import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { PedidoService } from '../../servicos/pedido.service';

interface ItemPedido {
  iditem: number;
  nomeItem: string;
  quantidade: number;
  valorUnitario: number;
  subtotal: number;
}

interface PedidoDetalhes {
  idpedido: number;
  idpessoa: number;
  cliente: string;
  dataPedido: string;
  statusPedido: string;
  valorTotal: number;
  itens: ItemPedido[];
}

@Component({
  selector: 'app-detalhes-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalhes-pedidos.html',
  styleUrl: './detalhes-pedidos.css',
})
export class DetalhesPedidos implements OnInit {
  private readonly pedidoService = inject(PedidoService);
  private readonly route = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cdr = inject(ChangeDetectorRef);

  pedido: PedidoDetalhes | null = null;

  carregando = false;
  erro = '';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const idPedido = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(idPedido) || idPedido <= 0) {
      this.erro = 'Pedido inválido.';
      this.cdr.detectChanges();
      return;
    }

    this.carregarPedido(idPedido);
  }

  carregarPedido(idPedido: number): void {
    this.carregando = true;
    this.erro = '';

    this.pedidoService.buscarPedidoPorId(idPedido).subscribe({
      next: (resposta: PedidoDetalhes) => {
        const idSalvo = localStorage.getItem('idPessoa');
        const idPessoa = Number(idSalvo);

        if (
          !Number.isInteger(idPessoa) ||
          idPessoa <= 0 ||
          Number(resposta.idpessoa) !== idPessoa
        ) {
          this.pedido = null;
          this.erro = 'Pedido não encontrado para este cliente.';
        } else {
          this.pedido = resposta;
        }

        this.carregando = false;
        this.cdr.detectChanges();
      },

      error: (erro: any) => {
        console.error('Erro ao carregar pedido:', erro);

        this.erro = 'Não foi possível carregar os detalhes do pedido.';
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }
}
