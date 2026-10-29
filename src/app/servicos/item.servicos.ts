
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Item, ItemCriarDTO } from '../models/item';
import { Categoria } from '../models/categoria';

@Injectable({
  providedIn: 'root'
})
export class ItemServicos {
  private readonly http = inject(HttpClient);

  private readonly apiItens = `${environment.apiUrl}/api/Item`;
  private readonly apiCategorias = `${environment.apiUrl}/api/Categorium`;

  listarItens(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiItens);
  }

  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiCategorias);
  }

  cadastrarItem(item: ItemCriarDTO): Observable<Item> {
    return this.http.post<Item>(this.apiItens, item);
  }

  atualizarItem(id: number, item: ItemCriarDTO): Observable<void> {
    return this.http.put<void>(`${this.apiItens}/${id}`, item);
  }

  excluirItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiItens}/${id}`);
  }
}
