
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Estoque, EstoqueAtualizarDTO } from '../models/estoque';

@Injectable({
  providedIn: 'root'
})
export class EstoqueServicos {

  private readonly http = inject(HttpClient);

  private readonly apiEstoque = `${environment.apiUrl}/api/Estoque`;

  // LISTAR TODOS OS ESTOQUES
  listarEstoques(): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(this.apiEstoque);
  }

  // CONSULTAR ESTOQUE POR ID
  buscarEstoque(id: number): Observable<Estoque> {
    return this.http.get<Estoque>(`${this.apiEstoque}/${id}`);
  }

  // ATUALIZAR QUANTIDADE DO ESTOQUE
  atualizarEstoque(id: number, dados: EstoqueAtualizarDTO): Observable<void> {
    return this.http.put<void>(`${this.apiEstoque}/${id}`, dados);
  }
}
