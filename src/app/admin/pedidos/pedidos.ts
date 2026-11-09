
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PedidoService } from '../../servicos/pedido.service';

interface PedidoAdmin {
  idpedido: number;
  idpessoa: number;
  cliente?: string;
  dataPedido: string;
  statusPedido: string;
  valorTotal: number;

  itens: {
    iditem: number;
    nomeItem: string;
    quantidade: number;
    valorUnitario: number;
    subtotal: number;
  }[];

  novoStatus?: string;
  salvando?: boolean;
}

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css'
})
export class Pedidos implements OnInit {

  private readonly pedidoService = inject(PedidoService);

  pedidos: PedidoAdmin[] = [];

  carregando = false;
  erro = '';
  mensagem = '';

  statusDisponiveis = [
    'Pendente',
    'Em andamento',
    'Concluído',
    'Cancelado'
  ];

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    this.carregando = true;
    this.erro = '';

    this.pedidoService.listarPedidos().subscribe({
      next: (resposta) => {
        this.pedidos = (resposta as PedidoAdmin[]).map(pedido => ({
          ...pedido,
          novoStatus: pedido.statusPedido,
          salvando: false
        }));

        this.carregando = false;
      },

      error: (erro) => {
        console.error('Erro ao carregar pedidos:', erro);
        this.erro = 'Não foi possível carregar os pedidos.';
        this.carregando = false;
      }
    });
  }

  salvarStatus(pedido: PedidoAdmin): void {
    this.erro = '';
    this.mensagem = '';

    if (pedido.salvando || !pedido.novoStatus) {
      return;
    }

    if (pedido.novoStatus === pedido.statusPedido) {
      return;
    }

    pedido.salvando = true;

    this.pedidoService.atualizarStatus(
      pedido.idpedido,
      pedido.novoStatus
    ).subscribe({
      next: (resposta) => {
        pedido.statusPedido = resposta.statusPedido;
        pedido.novoStatus = resposta.statusPedido;
        pedido.salvando = false;

        this.mensagem =
          `Status do pedido #${pedido.idpedido} atualizado com sucesso!`;
      },

      error: (erro) => {
        console.error('Erro ao atualizar status:', erro);
        pedido.salvando = false;

        this.erro =
          erro.error?.mensagem ||
          'Não foi possível atualizar o status do pedido.';
      }
    });
  }
}
