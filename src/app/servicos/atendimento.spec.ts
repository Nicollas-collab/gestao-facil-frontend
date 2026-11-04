import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environments';
import { Atendimento } from '../models/atendimento';

@Injectable({
  providedIn: 'root'
})
export class AtendimentoService {

  private readonly http = inject(HttpClient);

  private readonly apiAtendimentos =
    `${environment.apiUrl}/api/Atendimento`;

  // LISTAR TODOS OS ATENDIMENTOS
  listarAtendimentos(): Observable<Atendimento[]> {
    return this.http.get<Atendimento[]>(this.apiAtendimentos);
  }

  // BUSCAR ATENDIMENTO PELO ID
  buscarAtendimento(id: number): Observable<Atendimento> {
    return this.http.get<Atendimento>(
      `${this.apiAtendimentos}/${id}`
    );
  }

  // CADASTRAR ATENDIMENTO
  cadastrarAtendimento(atendimento: Atendimento): Observable<Atendimento> {
    return this.http.post<Atendimento>(
      this.apiAtendimentos,
      atendimento
    );
  }

  // ATUALIZAR ATENDIMENTO
  atualizarAtendimento(
    id: number,
    atendimento: Atendimento
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiAtendimentos}/${id}`,
      atendimento
    );
  }

  // EXCLUIR ATENDIMENTO
  excluirAtendimento(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiAtendimentos}/${id}`
    );
  }
}