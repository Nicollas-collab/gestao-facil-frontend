
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { PessoaService } from '../../servicos/pessoa.service';
import { Pessoa } from '../../models/pessoa';

@Component({
  selector: 'app-cadastro-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-cliente.html',
  styleUrl: './cadastro-cliente.css'
})
export class CadastroCliente {

  private readonly pessoaService = inject(PessoaService);
  private readonly router = inject(Router);

  pessoa: Pessoa = {
    nome: '',
    CPF: 0,
    dataNascimento: '',
    sexo: '',
    email: '',
    telefone: 0,
    ativoPessoa: 'S',
    enderecos: [
      {
        cep: '',
        numero: '',
        complemento: ''
      }
    ]
  };

  mensagem = '';
  erro = '';
  cadastrando = false;

  cadastrar(): void {
    if (this.cadastrando) {
      return;
    }

    this.mensagem = '';
    this.erro = '';
    this.cadastrando = true;

    this.pessoaService.cadastrarPessoa(this.pessoa).subscribe({
      next: (resposta) => {
        this.cadastrando = false;

        if (!resposta.idPessoa) {
          this.erro =
            'Cadastro realizado, mas não foi possível identificar o cliente.';
          return;
        }

        // Guarda o ID do cliente para realizar pedidos
        localStorage.setItem(
          'idPessoa',
          resposta.idPessoa.toString()
        );

        this.mensagem = 'Cadastro realizado com sucesso!';

        // Redireciona o cliente para o catálogo
        setTimeout(() => {
          this.router.navigate(['/catalogo']);
        }, 1500);
      },

      error: (erro) => {
        this.cadastrando = false;

        console.error('Erro ao cadastrar cliente:', erro);

        this.erro =
          'Não foi possível realizar o cadastro. Verifique os dados e tente novamente.';
      }
    });
  }
}
