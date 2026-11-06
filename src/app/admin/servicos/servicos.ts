
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Item, ItemCriarDTO } from '../../models/item';
import { Categoria } from '../../models/categoria';
import { ItemServicos } from '../../servicos/item.servicos';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicos.html',
  styleUrl: './servicos.css'
})
export class Servicos implements OnInit {

  private readonly itemServicos = inject(ItemServicos);

  servicos: Item[] = [];
  categorias: Categoria[] = [];

  servico: ItemCriarDTO = this.novoServico();

  idEdicao: number | null = null;
  carregando = false;
  mensagem = '';
  erro = '';

  ngOnInit(): void {
    this.listarServicos();
    this.listarCategorias();
  }

  novoServico(): ItemCriarDTO {
    return {
      idcategoria: 0,
      item1: '',
      descricaoItem: '',
      preco: 0,
      tipoItem: 'S',
      ativoProdutoServico: 'S'
    };
  }

  listarServicos(): void {
    this.carregando = true;
    this.erro = '';

    this.itemServicos.listarServicos().subscribe({
      next: (dados) => {
        this.servicos = dados;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar serviços:', erro);
        this.erro = 'Não foi possível carregar os serviços.';
        this.carregando = false;
      }
    });
  }

  listarCategorias(): void {
    this.itemServicos.listarCategorias().subscribe({
      next: (dados) => {
        this.categorias = dados;
      },
      error: (erro) => {
        console.error('Erro ao carregar categorias:', erro);
        this.erro = 'Não foi possível carregar as categorias.';
      }
    });
  }

  salvarServico(): void {
    this.mensagem = '';
    this.erro = '';

    if (
      !this.servico.idcategoria ||
      !this.servico.item1.trim() ||
      !this.servico.descricaoItem.trim() ||
      this.servico.preco < 0
    ) {
      this.erro = 'Preencha todos os campos corretamente.';
      return;
    }

    if (this.idEdicao !== null) {
      this.itemServicos.atualizarServico(
        this.idEdicao,
        this.servico
      ).subscribe({
        next: () => {
          this.mensagem = 'Serviço atualizado com sucesso!';
          this.cancelarEdicao();
          this.listarServicos();
        },
        error: (erro) => {
          console.error('Erro ao atualizar serviço:', erro);
          this.erro = 'Não foi possível atualizar o serviço.';
        }
      });

    } else {
      this.itemServicos.cadastrarServico(this.servico).subscribe({
        next: () => {
          this.mensagem = 'Serviço cadastrado com sucesso!';
          this.limparFormulario();
          this.listarServicos();
        },
        error: (erro) => {
          console.error('Erro ao cadastrar serviço:', erro);
          this.erro = 'Não foi possível cadastrar o serviço.';
        }
      });
    }
  }

  editarServico(servico: Item): void {
    if (!servico.iditem) {
      return;
    }

    this.itemServicos.buscarServico(servico.iditem).subscribe({
      next: (dados) => {
        this.idEdicao = dados.iditem!;

        this.servico = {
          idcategoria: dados.idcategoria,
          item1: dados.item1,
          descricaoItem: dados.descricaoItem,
          preco: dados.preco,
          tipoItem: 'S',
          ativoProdutoServico: 'S'
        };

        this.mensagem = '';
        this.erro = '';
      },
      error: (erro) => {
        console.error('Erro ao consultar serviço:', erro);
        this.erro = 'Não foi possível carregar o serviço para edição.';
      }
    });
  }

  desativarServico(id: number): void {
    if (!confirm('Deseja realmente desativar este serviço?')) {
      return;
    }

    this.mensagem = '';
    this.erro = '';

    this.itemServicos.desativarServico(id).subscribe({
      next: () => {
        this.mensagem = 'Serviço desativado com sucesso!';
        this.listarServicos();
      },
      error: (erro) => {
        console.error('Erro ao desativar serviço:', erro);
        this.erro = 'Não foi possível desativar o serviço.';
      }
    });
  }

  limparFormulario(): void {
    this.servico = this.novoServico();
    this.idEdicao = null;
  }

  cancelarEdicao(): void {
    this.limparFormulario();
    this.mensagem = '';
    this.erro = '';
  }
}
