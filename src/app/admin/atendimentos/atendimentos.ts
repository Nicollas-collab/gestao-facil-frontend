
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Atendimento } from '../../models/atendimento';
import { Pessoa } from '../../models/pessoa';

import { AtendimentoService } from '../../servicos/atendimento.servicos';
import { PessoaService } from '../../servicos/pessoa.service';

@Component({
  selector: 'app-atendimentos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './atendimentos.html',
  styleUrl: './atendimentos.css'
})
export class Atendimentos implements OnInit {

  atendimentos: Atendimento[] = [];
  pessoas: Pessoa[] = [];

  formulario: Atendimento = this.novoAtendimento();

  editando = false;
  carregando = false;
  carregandoPessoas = false;
  mensagem = '';
  erro = '';

  constructor(
    private atendimentoService: AtendimentoService,
    private pessoaService: PessoaService
  ) {}

  ngOnInit(): void {
    this.listarAtendimentos();
    this.listarPessoas();
  }

  novoAtendimento(): Atendimento {
    return {
      idpessoa: 0,
      dataAtendimento: new Date().toISOString().substring(0, 10),
      statusAtendimento: 'Aberto'
    };
  }

  listarPessoas(): void {
    this.carregandoPessoas = true;

    this.pessoaService.listarPessoas().subscribe({
      next: (dados) => {
        this.pessoas = dados;
        this.carregandoPessoas = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar pessoas:', erro);
        this.erro = 'Não foi possível carregar as pessoas cadastradas.';
        this.carregandoPessoas = false;
      }
    });
  }

  listarAtendimentos(): void {
    this.carregando = true;
    this.erro = '';

    this.atendimentoService.listar().subscribe({
      next: (dados) => {
        this.atendimentos = dados;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar atendimentos:', erro);
        this.erro = 'Não foi possível carregar os atendimentos. Confira se a API está funcionando.';
        this.carregando = false;
      }
    });
  }

  salvar(): void {
    this.mensagem = '';
    this.erro = '';

    if (
      !this.formulario.idpessoa ||
      !this.formulario.dataAtendimento ||
      !this.formulario.statusAtendimento.trim()
    ) {
      this.erro = 'Preencha a pessoa, a data e o status.';
      return;
    }

    const dados: Atendimento = {
      idpessoa: Number(this.formulario.idpessoa),
      dataAtendimento: this.formulario.dataAtendimento,
      statusAtendimento: this.formulario.statusAtendimento.trim()
    };

    this.carregando = true;

    if (this.editando && this.formulario.idatendimento != null) {
      const id = this.formulario.idatendimento;

      this.atendimentoService.atualizar(id, dados).subscribe({
        next: () => {
          this.mensagem = 'Atendimento atualizado com sucesso!';
          this.cancelarEdicao();
          this.listarAtendimentos();
        },
        error: (erro) => {
          console.error('Erro ao atualizar atendimento:', erro);
          this.erro = erro.error?.mensagem || 'Não foi possível atualizar o atendimento.';
          this.carregando = false;
        }
      });
    } else {
      this.atendimentoService.cadastrar(dados).subscribe({
        next: () => {
          this.mensagem = 'Atendimento cadastrado com sucesso!';
          this.formulario = this.novoAtendimento();
          this.listarAtendimentos();
        },
        error: (erro) => {
          console.error('Erro ao cadastrar atendimento:', erro);
          this.erro = erro.error?.mensagem || 'Não foi possível cadastrar o atendimento.';
          this.carregando = false;
        }
      });
    }
  }

  editar(atendimento: Atendimento): void {
    this.formulario = {
      idatendimento: atendimento.idatendimento,
      idpessoa: atendimento.idpessoa,
      dataAtendimento: atendimento.dataAtendimento.substring(0, 10),
      statusAtendimento: atendimento.statusAtendimento
    };

    this.editando = true;
    this.mensagem = '';
    this.erro = '';
  }

  cancelarEdicao(): void {
    this.formulario = this.novoAtendimento();
    this.editando = false;
  }

  excluir(atendimento: Atendimento): void {
    if (atendimento.idatendimento == null) {
      return;
    }

    const confirmar = confirm(
      `Deseja excluir o atendimento ${atendimento.idatendimento}?`
    );

    if (!confirmar) {
      return;
    }

    this.mensagem = '';
    this.erro = '';

    this.atendimentoService.excluir(atendimento.idatendimento).subscribe({
      next: () => {
        this.mensagem = 'Atendimento excluído com sucesso!';
        this.listarAtendimentos();
      },
      error: (erro) => {
        console.error('Erro ao excluir atendimento:', erro);
        this.erro = erro.error?.mensagem ||
          'Não foi possível excluir. Verifique se existem itens associados a este atendimento.';
      }
    });
  }

  // Retorna o nome da pessoa pelo ID associado ao atendimento.
  nomePessoa(idPessoa: number): string {
    const pessoa = this.pessoas.find(
      p => p.idPessoa === idPessoa
    );

    return pessoa ? pessoa.nome : 'Pessoa não encontrada';
  }

}
