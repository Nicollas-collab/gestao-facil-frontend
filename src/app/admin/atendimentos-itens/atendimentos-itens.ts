
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Atendimento } from '../../models/atendimento';
import { Item } from '../../models/item';
import { Funcionario } from '../../models/funcionario';
import { Atendimentoitem } from '../../models/atendimentoitem';

import { AtendimentoService } from '../../servicos/atendimento.servicos';
import { ItemServicos } from '../../servicos/item.servicos';
import { FuncionarioServicos } from '../../servicos/funcionario.servicos';
import { AtendimentoitemService } from '../../servicos/atendimentoitem.servicos';

@Component({
  selector: 'app-atendimentos-itens',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './atendimentos-itens.html',
  styleUrl: './atendimentos-itens.css',
})
export class AtendimentosItens implements OnInit {

  atendimentos: Atendimento[] = [];
  itens: Item[] = [];
  funcionarios: Funcionario[] = [];
  atendimentosItens: Atendimentoitem[] = [];

  formulario: Atendimentoitem = this.novoRegistro();

  editando = false;
  carregando = false;
  mensagem = '';
  erro = '';

  constructor(
    private atendimentoService: AtendimentoService,
    private itemService: ItemServicos,
    private funcionarioService: FuncionarioServicos,
    private atendimentoitemService: AtendimentoitemService
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  novoRegistro(): Atendimentoitem {
    return {
      idatendimento: 0,
      iditem: 0,
      idfuncionario: 0,
      quantidadeItens: 1,
      valorunitarioEntrada: 0
    };
  }

  carregarDados(): void {
    this.carregando = true;
    this.erro = '';

    this.atendimentoService.listar().subscribe({
      next: dados => {
        this.atendimentos = dados;
      },
      error: erro => {
        console.error('Erro ao carregar atendimentos:', erro);
        this.erro = 'Não foi possível carregar os atendimentos.';
      }
    });

    this.itemService.listarItens().subscribe({
      next: dados => {
        this.itens = dados.filter(
          item => item.ativoProdutoServico === 'S'
        );
      },
      error: erro => {
        console.error('Erro ao carregar itens:', erro);
        this.erro = 'Não foi possível carregar os produtos e serviços.';
      }
    });

    this.funcionarioService.listarFuncionarios().subscribe({
      next: dados => {
        this.funcionarios = dados;
      },
      error: erro => {
        console.error('Erro ao carregar funcionários:', erro);
        this.erro = 'Não foi possível carregar os funcionários.';
      }
    });

    this.listarAtendimentosItens();
  }

  listarAtendimentosItens(): void {
    this.atendimentoitemService.listar().subscribe({
      next: dados => {
        this.atendimentosItens = dados;
        this.carregando = false;
      },
      error: erro => {
        console.error('Erro ao carregar itens dos atendimentos:', erro);
        this.erro = 'Não foi possível carregar os itens dos atendimentos.';
        this.carregando = false;
      }
    });
  }

  salvar(): void {
    this.erro = '';
    this.mensagem = '';

    const dados: Atendimentoitem = {
      idatendimento: Number(this.formulario.idatendimento),
      iditem: Number(this.formulario.iditem),
      idfuncionario: Number(this.formulario.idfuncionario),
      quantidadeItens: Number(this.formulario.quantidadeItens),
      valorunitarioEntrada: Number(this.formulario.valorunitarioEntrada)
    };

    if (
      !dados.idatendimento ||
      !dados.iditem ||
      !dados.idfuncionario ||
      dados.quantidadeItens <= 0 ||
      dados.valorunitarioEntrada < 0
    ) {
      this.erro = 'Preencha todos os campos corretamente.';
      return;
    }

    this.carregando = true;

    if (this.editando) {
      this.atendimentoitemService.atualizar(
        dados.idatendimento,
        dados.iditem,
        dados
      ).subscribe({
        next: () => {
          this.mensagem = 'Item do atendimento atualizado com sucesso!';
          this.cancelarEdicao();
          this.listarAtendimentosItens();
        },
        error: erro => {
          console.error('Erro ao atualizar:', erro);
          this.erro = erro.error?.mensagem || 'Não foi possível atualizar o item.';
          this.carregando = false;
        }
      });
    } else {
      this.atendimentoitemService.cadastrar(dados).subscribe({
        next: () => {
          this.mensagem = 'Item vinculado ao atendimento com sucesso!';
          this.formulario = this.novoRegistro();
          this.listarAtendimentosItens();
        },
        error: erro => {
          console.error('Erro ao cadastrar:', erro);
          this.erro = erro.error?.mensagem || 'Não foi possível vincular o item.';
          this.carregando = false;
        }
      });
    }
  }

  editar(registro: Atendimentoitem): void {
    this.formulario = { ...registro };
    this.editando = true;
    this.mensagem = '';
    this.erro = '';
  }

  cancelarEdicao(): void {
    this.formulario = this.novoRegistro();
    this.editando = false;
  }

  excluir(registro: Atendimentoitem): void {
    const confirmar = confirm(
      'Deseja remover este item do atendimento?'
    );

    if (!confirmar) return;

    this.atendimentoitemService.excluir(
      registro.idatendimento,
      registro.iditem
    ).subscribe({
      next: () => {
        this.mensagem = 'Item removido com sucesso!';
        this.listarAtendimentosItens();
      },
      error: erro => {
        console.error('Erro ao excluir:', erro);
        this.erro = erro.error?.mensagem || 'Não foi possível remover o item.';
      }
    });
  }

  nomeAtendimento(id: number): string {
    const atendimento = this.atendimentos.find(
      a => a.idatendimento === id
    );

    return atendimento
      ? `Atendimento ${atendimento.idatendimento}`
      : 'Atendimento não encontrado';
  }

  nomeItem(id: number): string {
    const item = this.itens.find(i => i.iditem === id);
    return item ? item.item1 : 'Item não encontrado';
  }

  nomeFuncionario(id: number): string {
    const funcionario = this.funcionarios.find(
      f => f.idpessoa === id
    );

    return funcionario ? funcionario.nome : 'Funcionário não encontrado';
  }

  atualizarValor(): void {
    const item = this.itens.find(
      i => i.iditem === Number(this.formulario.iditem)
    );

    if (item) {
      this.formulario.valorunitarioEntrada = item.preco;
    }
  }
}
