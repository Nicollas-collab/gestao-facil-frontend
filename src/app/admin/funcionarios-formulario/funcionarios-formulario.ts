
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { FuncionarioServicos } from '../../servicos/funcionario.servicos';
import { FuncionarioCriarDTO, Endereco } from '../../models/funcionario';

@Component({
  selector: 'app-funcionarios-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './funcionarios-formulario.html',
  styleUrl: './funcionarios-formulario.css'
})
export class FuncionariosFormulario implements OnInit {

  idFuncionario: number | null = null;
  editando = false;

  funcionario: FuncionarioCriarDTO = {
    nome: '',
    cpf: 0,
    dataNascimento: '',
    sexo: '',
    email: '',
    telefone: 0,
    ativoPessoa: 'S',
    cargo: '',
    dataAdmissao: '',
    enderecos: []
  };

  endereco: Endereco = {
    cep: '',
    numero: '',
    complemento: ''
  };

  erro = '';
  sucesso = '';
  carregando = false;

  constructor(
    private funcionarioServicos: FuncionarioServicos,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.idFuncionario = Number(id);
      this.editando = true;
      this.buscarFuncionario();
    }
  }

  buscarFuncionario(): void {
    if (this.idFuncionario === null) return;

    this.carregando = true;

    this.funcionarioServicos.buscarFuncionario(this.idFuncionario).subscribe({
      next: (dados) => {
        this.funcionario = {
          nome: dados.nome,
          cpf: dados.cpf,
          dataNascimento: dados.dataNascimento,
          sexo: dados.sexo,
          email: dados.email,
          telefone: dados.telefone,
          ativoPessoa: dados.ativoPessoa,
          cargo: dados.cargo,
          dataAdmissao: dados.dataAdmissao,
          enderecos: dados.enderecos.map(e => ({ ...e }))
        };

        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar funcionário:', erro);
        this.erro = 'Não foi possível carregar os dados do funcionário.';
        this.carregando = false;
      }
    });
  }

  adicionarEndereco(): void {
    if (!this.endereco.cep || !this.endereco.numero) {
      this.erro = 'Preencha o CEP e o número do endereço.';
      return;
    }

    this.funcionario.enderecos.push({ ...this.endereco });

    this.endereco = {
      cep: '',
      numero: '',
      complemento: ''
    };

    this.erro = '';
  }

  removerEndereco(index: number): void {
    this.funcionario.enderecos.splice(index, 1);
  }

  cadastrarFuncionario(): void {
    this.erro = '';
    this.sucesso = '';

    if (this.funcionario.enderecos.length === 0) {
      this.erro = 'Adicione pelo menos um endereço.';
      return;
    }

    this.carregando = true;

    if (this.editando && this.idFuncionario !== null) {
      this.funcionarioServicos.atualizarFuncionario(
        this.idFuncionario,
        this.funcionario
      ).subscribe({
        next: () => {
          this.sucesso = 'Funcionário atualizado com sucesso!';
          this.carregando = false;

          setTimeout(() => {
            this.router.navigate(['/admin/funcionarios']);
          }, 1500);
        },
        error: (erro) => {
          console.error('Erro ao atualizar funcionário:', erro);
          this.erro = erro.error?.mensagem || 'Não foi possível atualizar o funcionário.';
          this.carregando = false;
        }
      });

    } else {
      this.funcionarioServicos.cadastrarFuncionario(this.funcionario).subscribe({
        next: () => {
          this.sucesso = 'Funcionário cadastrado com sucesso!';
          this.carregando = false;

          setTimeout(() => {
            this.router.navigate(['/admin/funcionarios']);
          }, 1500);
        },
        error: (erro) => {
          console.error('Erro ao cadastrar funcionário:', erro);
          this.erro = erro.error?.mensagem || 'Não foi possível cadastrar o funcionário.';
          this.carregando = false;
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/admin/funcionarios']);
  }
}
