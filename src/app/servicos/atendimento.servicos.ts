import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Atendimento } from '../models/atendimento';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AtendimentoService {
  private readonly apiUrl =
    `${environment.apiUrl}/api/Atendimento`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Atendimento[]> {
    return this.http.get<Atendimento[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Atendimento> {
    return this.http.get<Atendimento>(
      `${this.apiUrl}/${id}`
    );
  }
}