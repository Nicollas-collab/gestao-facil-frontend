import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import localePt from '@angular/common/locales/pt';

import { ItemServicos } from '../../servicos/item.servicos';
import { Item, ItemCriarDTO } from '../../models/item';
import { Categoria } from '../../models/categoria';

registerLocaleData(localePt);

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css',
})
export class Produtos implements OnInit {
  itens: Item[] = [];
  categorias: Categoria[] = [];

  carregando = false;
  salvando = false;
  erro = '';
  mensagem = '';
  editandoId: number | null = null;

  formulario: ItemCriarDTO = this.novoFormulario();

  constructor(private itemServicos: ItemServicos) {}

  ngOnInit(): void {
    this.listarItens();
    this.listarCategorias();
  }

  novoFormulario(): ItemCriarDTO {
    return {
      idcategoria: 0,
      item1: '',
      descricaoItem: '',
      preco: 0,
      tipoItem: '',
      ativoProdutoServico: 'S',
    };
  }

  listarItens(): void {
    this.carregando = true;
    this.erro = '';

    this.itemServicos.listarItens().subscribe({
      next: (dados: Item[]) => {
        this.itens = dados;
        this.carregando = false;
      },
      error: (erro: unknown) => {
        console.error('Erro ao carregar itens:', erro);
        this.erro = 'Não foi possível carregar os produtos e serviços.';
        this.carregando = false;
      },
    });
  }

  listarCategorias(): void {
    this.itemServicos.listarCategorias().subscribe({
      next: (dados: Categoria[]) => {
        this.categorias = dados;
      },
      error: (erro: unknown) => {
        console.error('Erro ao carregar categorias:', erro);
        this.erro = 'Não foi possível carregar as categorias.';
      },
    });
  }

  salvar(): void {
    if (
      !this.formulario.idcategoria ||
      !this.formulario.item1.trim() ||
      !this.formulario.descricaoItem.trim() ||
      this.formulario.preco < 0 ||
      !this.formulario.tipoItem ||
      !this.formulario.ativoProdutoServico
    ) {
      this.erro = 'Preencha todos os campos corretamente.';
      return;
    }

    this.salvando = true;
    this.erro = '';
    this.mensagem = '';

    const dados: ItemCriarDTO = {
      idcategoria: this.formulario.idcategoria,
      item1: this.formulario.item1.trim(),
      descricaoItem: this.formulario.descricaoItem.trim(),
      preco: this.formulario.preco,
      tipoItem: this.formulario.tipoItem,
      ativoProdutoServico: this.formulario.ativoProdutoServico,
    };

    if (this.editandoId !== null) {
      this.itemServicos.atualizarItem(this.editandoId, dados).subscribe({
        next: () => {
          this.mensagem = 'Item atualizado com sucesso!';
          this.limparFormulario();
          this.salvando = false;
          this.listarItens();
        },
        error: (erro: unknown) => {
          console.error('Erro ao atualizar item:', erro);
          this.erro = 'Não foi possível atualizar o item.';
          this.salvando = false;
        },
      });
    } else {
      this.itemServicos.cadastrarItem(dados).subscribe({
        next: () => {
          this.mensagem = 'Item cadastrado com sucesso!';
          this.limparFormulario();
          this.salvando = false;
          this.listarItens();
        },
        error: (erro: unknown) => {
          console.error('Erro ao cadastrar item:', erro);
          this.erro = 'Não foi possível cadastrar o item.';
          this.salvando = false;
        },
      });
    }
  }

  editar(item: Item): void {
    if (item.iditem === undefined) {
      return;
    }

    this.editandoId = item.iditem;

    this.formulario = {
      idcategoria: item.idcategoria,
      item1: item.item1,
      descricaoItem: item.descricaoItem,
      preco: item.preco,
      tipoItem: item.tipoItem,
      ativoProdutoServico: item.ativoProdutoServico,
    };

    this.mensagem = '';
    this.erro = '';
  }

  excluir(item: Item): void {
    if (item.iditem === undefined) {
      return;
    }

    const confirmar = window.confirm(`Deseja excluir "${item.item1}"?`);

    if (!confirmar) {
      return;
    }

    this.erro = '';
    this.mensagem = '';

    this.itemServicos.excluirItem(item.iditem).subscribe({
      next: () => {
        this.mensagem = 'Item excluído com sucesso.';
        this.listarItens();
      },
      error: (erro: any) => {
        console.error('Erro ao excluir item:', erro);

        console.log('Status HTTP:', erro.status);
        console.log('Resposta do backend:', erro.error);

        this.erro = erro.error?.mensagem ?? 'Não foi possível excluir o item.';
      },
    });
  }

  limparFormulario(): void {
    this.formulario = this.novoFormulario();
    this.editandoId = null;
  }
}
