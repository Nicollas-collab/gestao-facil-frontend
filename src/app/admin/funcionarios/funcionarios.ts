import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FuncionarioServicos } from '../../servicos/funcionario.servicos';
import { Funcionario } from '../../models/funcionario';

@Component({
  selector: 'app-funcionarios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './funcionarios.html',
  styleUrl: './funcionarios.css',
})
export class Funcionarios implements OnInit {
  funcionarios: Funcionario[] = [];
  carregando = false;
  erro = '';

  constructor(private funcionarioServicos: FuncionarioServicos) {}

  ngOnInit(): void {
    this.listarFuncionarios();
  }

  listarFuncionarios(): void {
    this.carregando = true;
    this.erro = '';

    this.funcionarioServicos.listarFuncionarios().subscribe({
      next: (dados) => {
        this.funcionarios = dados;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar funcionários:', erro);
        this.erro = 'Não foi possível carregar os funcionários.';
        this.carregando = false;
      },
    });
  }
  excluirFuncionario(id: number): void {
    const confirmar = confirm(
      'Tem certeza que deseja excluir este funcionário?'
    );
  
    if (!confirmar) {
      return;
    }
  
    this.funcionarioServicos.excluirFuncionario(id).subscribe({
      next: () => {
        alert('Funcionário excluído com sucesso!');
        this.listarFuncionarios();
      },
      error: (erro) => {
        console.error('Erro ao excluir funcionário:', erro);
  
        if (erro.status === 409) {
          alert(
            'Não é possível excluir este funcionário, pois ele está vinculado a um atendimento.'
          );
        } else {
          alert('Não foi possível excluir o funcionário.');
        }
      }
    });
  }
}
