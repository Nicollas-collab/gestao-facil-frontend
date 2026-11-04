import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environments';
import { Pessoa } from '../models/pessoa';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  private readonly http = inject(HttpClient);

  private readonly apiPessoas =
    `${environment.apiUrl}/api/PessoaEndereco`;

  listarPessoas(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(this.apiPessoas);
  }
}