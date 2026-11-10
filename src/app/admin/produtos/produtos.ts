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
      tipoItem: 'P',
      ativoProdutoServico: 'S',
      unidade: 'UN',
      quantidadeInicial: 0,
    };
  }

  listarItens(): void {
    this.carregando = true;
    this.erro = '';

    this.itemServicos.listarItens().subscribe({
      next: (dados: Item[]) => {
        this.itens = dados.filter((item) => item.tipoItem === 'P');
        this.carregando = false;
      },
      error: (erro: unknown) => {
        console.error('Erro ao carregar produtos:', erro);
        this.erro = 'Não foi possível carregar os produtos.';
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
    this.erro = '';
    this.mensagem = '';

    if (
      !this.formulario.idcategoria ||
      !this.formulario.item1.trim() ||
      !this.formulario.descricaoItem.trim() ||
      !Number.isFinite(this.formulario.preco) ||
      this.formulario.preco < 0 ||
      !this.formulario.ativoProdutoServico
    ) {
      this.erro = 'Preencha todos os campos corretamente.';
      return;
    }

    if (this.editandoId === null) {
      if (
        !this.formulario.unidade ||
        this.formulario.quantidadeInicial == null ||
        !Number.isInteger(this.formulario.quantidadeInicial) ||
        this.formulario.quantidadeInicial < 0
      ) {
        this.erro = 'Informe a unidade e uma quantidade inicial válida.';
        return;
      }
    }

    this.salvando = true;

    const dados: ItemCriarDTO = {
      idcategoria: this.formulario.idcategoria,
      item1: this.formulario.item1.trim(),
      descricaoItem: this.formulario.descricaoItem.trim(),
      preco: this.formulario.preco,
      tipoItem: 'P',
      ativoProdutoServico: this.formulario.ativoProdutoServico,
    };

    // Unidade e quantidade são enviadas no cadastro.
    if (this.editandoId === null) {
      dados.unidade = this.formulario.unidade;
      dados.quantidadeInicial = this.formulario.quantidadeInicial;
    }

    if (this.editandoId !== null) {
      this.itemServicos.atualizarItem(this.editandoId, dados).subscribe({
        next: () => {
          this.limparFormulario();
          this.mensagem = 'Produto atualizado com sucesso!';
          this.salvando = false;
          this.listarItens();
        },
        error: (erro: any) => {
          console.error('Erro ao atualizar produto:', erro);
          this.erro = erro.error?.mensagem ?? 'Não foi possível atualizar o produto.';
          this.salvando = false;
        },
      });
    } else {
      this.itemServicos.cadastrarItem(dados).subscribe({
        next: () => {
          this.limparFormulario();
          this.mensagem = 'Produto cadastrado com sucesso!';
          this.salvando = false;
          this.listarItens();
        },
        error: (erro: any) => {
          console.error('Erro ao cadastrar produto:', erro);
          this.erro = erro.error?.mensagem ?? 'Não foi possível cadastrar o produto.';
          this.salvando = false;
        },
      });
    }
  }

  editar(item: Item): void {
    if (item.iditem === undefined) return;

    this.editandoId = item.iditem;

    this.formulario = {
      idcategoria: item.idcategoria,
      item1: item.item1,
      descricaoItem: item.descricaoItem,
      preco: item.preco,
      tipoItem: 'P',
      ativoProdutoServico: item.ativoProdutoServico,
    };

    this.mensagem = '';
    this.erro = '';
  }

  excluir(item: Item): void {
    if (item.iditem === undefined) return;

    const confirmar = window.confirm(`Deseja excluir "${item.item1}"?`);

    if (!confirmar) return;

    this.erro = '';
    this.mensagem = '';

    this.itemServicos.excluirItem(item.iditem).subscribe({
      next: () => {
        this.mensagem = 'Produto excluído com sucesso!';
        this.listarItens();
      },
      error: (erro: any) => {
        console.error('Erro ao excluir produto:', erro);
        this.erro = erro.error?.mensagem ?? 'Não foi possível excluir o produto.';
      },
    });
  }

  desativar(item: Item): void {
    if (item.iditem === undefined || item.tipoItem !== 'P') {
      return;
    }

    const confirmar = window.confirm(`Deseja desativar o produto "${item.item1}"?`);

    if (!confirmar) return;

    this.erro = '';
    this.mensagem = '';

    this.itemServicos.desativarProduto(item.iditem).subscribe({
      next: (resposta) => {
        this.mensagem = resposta?.mensagem ?? 'Produto desativado com sucesso!';
        this.listarItens();
      },
      error: (erro: any) => {
        console.error('Erro ao desativar produto:', erro);
        this.erro = erro.error?.mensagem ?? 'Não foi possível desativar o produto.';
      },
    });
  }

  limparFormulario(): void {
    this.formulario = this.novoFormulario();
    this.editandoId = null;
  }
}
