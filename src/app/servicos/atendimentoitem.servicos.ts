
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environments';
import { Atendimentoitem } from '../models/atendimentoitem';

@Injectable({
  providedIn: 'root'
})
export class AtendimentoitemService {

  private readonly http = inject(HttpClient);

  private readonly apiAtendimentoitem =
    `${environment.apiUrl}/api/Atendimentoitem`;

  listar(): Observable<Atendimentoitem[]> {
    return this.http.get<Atendimentoitem[]>(
      this.apiAtendimentoitem
    );
  }

  cadastrar(dados: Atendimentoitem): Observable<Atendimentoitem> {
    return this.http.post<Atendimentoitem>(
      this.apiAtendimentoitem,
      dados
    );
  }

  atualizar(
    idatendimento: number,
    iditem: number,
    dados: Atendimentoitem
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiAtendimentoitem}/${idatendimento}/${iditem}`,
      dados
    );
  }

  excluir(
    idatendimento: number,
    iditem: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiAtendimentoitem}/${idatendimento}/${iditem}`
    );
  }
}
