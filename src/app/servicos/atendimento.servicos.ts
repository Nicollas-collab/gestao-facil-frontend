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

  listar(): Observable<Atendimento[]> {
    return this.http.get<Atendimento[]>(this.apiAtendimentos);
  }

  buscar(id: number): Observable<Atendimento> {
    return this.http.get<Atendimento>(`${this.apiAtendimentos}/${id}`);
  }

  cadastrar(atendimento: Atendimento): Observable<Atendimento> {
    return this.http.post<Atendimento>(this.apiAtendimentos, atendimento);
  }

  atualizar(id: number, atendimento: Atendimento): Observable<void> {
    return this.http.put<void>(`${this.apiAtendimentos}/${id}`, atendimento);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiAtendimentos}/${id}`);
  }
}