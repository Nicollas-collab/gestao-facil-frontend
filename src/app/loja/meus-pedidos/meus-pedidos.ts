
import {
  Component,
  OnInit,
  inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import { RouterLink } from '@angular/router';

import { PedidoService } from '../../servicos/pedido.service';

interface PedidoCliente {
  idpedido: number;
  idpessoa: number;
  cliente: string;
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
}

@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './meus-pedidos.html',
  styleUrl: './meus-pedidos.css'
})
export class MeusPedidos implements OnInit {

  private readonly pedidoService = inject(PedidoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cdr = inject(ChangeDetectorRef);

  pedidos: PedidoCliente[] = [];

  carregando = false;
  erro = '';
  idPessoa = 0;

  ngOnInit(): void {

    // Executa somente no navegador
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const idSalvo = localStorage.getItem('idPessoa');

    console.log('ID salvo no navegador:', idSalvo);

    this.idPessoa = Number(idSalvo);

    if (
      !Number.isInteger(this.idPessoa) ||
      this.idPessoa <= 0
    ) {
      this.erro =
        'Você precisa realizar o cadastro para consultar seus pedidos.';

      this.cdr.detectChanges();
      return;
    }

    this.carregarPedidos();
  }

  carregarPedidos(): void {

    this.carregando = true;
    this.erro = '';

    this.pedidoService.listarPedidos().subscribe({

      next: (resposta) => {

        console.log('ID do cliente:', this.idPessoa);
        console.log('Pedidos recebidos da API:', resposta);

        // Filtra somente os pedidos do cliente
        this.pedidos = (resposta as PedidoCliente[])
          .filter(
            pedido => Number(pedido.idpessoa) === this.idPessoa
          );

        console.log('Pedidos filtrados:', this.pedidos);

        this.carregando = false;

        // Força a atualização da interface
        this.cdr.detectChanges();
      },

      error: (erro) => {

        console.error('Erro ao carregar pedidos:', erro);

        this.erro =
          'Não foi possível carregar seus pedidos.';

        this.carregando = false;

        // Atualiza a interface em caso de erro
        this.cdr.detectChanges();
      }

    });
  }
}
