import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environments';

import {
  Funcionario,
  FuncionarioCriarDTO,
  FuncionarioAtualizarDTO
} from '../models/funcionario';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioServicos {

  private readonly http = inject(HttpClient);

  private readonly apiFuncionarios =
    `${environment.apiUrl}/api/Funcionario`;

  listarFuncionarios(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.apiFuncionarios);
  }

  buscarFuncionario(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(
      `${this.apiFuncionarios}/${id}`
    );
  }

  cadastrarFuncionario(
    funcionario: FuncionarioCriarDTO
  ): Observable<Funcionario> {
    return this.http.post<Funcionario>(
      this.apiFuncionarios,
      funcionario
    );
  }

  atualizarFuncionario(
    id: number,
    funcionario: FuncionarioAtualizarDTO
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiFuncionarios}/${id}`,
      funcionario
    );
  }

  excluirFuncionario(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiFuncionarios}/${id}`
    );
  }
}