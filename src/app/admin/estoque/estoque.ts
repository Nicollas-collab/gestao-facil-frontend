import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EstoqueServicos } from '../../servicos/estoque.servicos';
import { Estoque as EstoqueModel } from '../../models/estoque';

@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estoque.html',
  styleUrl: './estoque.css',
})
export class Estoque implements OnInit {
  private readonly estoqueServico = inject(EstoqueServicos);

  estoques: EstoqueModel[] = [];

  carregando = false;
  erro = '';
  mensagem = '';

  ngOnInit(): void {
    this.listarEstoques();
  }

  // LISTAR ESTOQUES
  listarEstoques(): void {
    this.carregando = true;
    this.erro = '';

    this.estoqueServico.listarEstoques().subscribe({
      next: (dados) => {
        this.estoques = dados;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar estoques:', erro);
        this.erro = 'Não foi possível carregar os estoques.';
        this.carregando = false;
      },
    });
  }

  // ATUALIZAR QUANTIDADE
  atualizarEstoque(estoque: EstoqueModel): void {
    if (estoque.quantidadeEstoque < 0) {
      this.erro = 'A quantidade não pode ser negativa.';
      return;
    }

    this.erro = '';
    this.mensagem = '';

    this.estoqueServico
      .atualizarEstoque(estoque.iditem, { quantidadeEstoque: estoque.quantidadeEstoque })
      .subscribe({
        next: () => {
          this.mensagem = 'Estoque atualizado com sucesso!';
          this.listarEstoques();
        },
        error: (erro) => {
          console.error('Erro ao atualizar estoque:', erro);
          this.erro = 'Não foi possível atualizar o estoque.';
        },
      });
  }
}
