
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

export interface PedidoItemCriarDTO {
  idItem: number;
  quantidade: number;
}

export interface PedidoCriarDTO {
  idPessoa: number;
  itens: PedidoItemCriarDTO[];
}

export interface PedidoResposta {
  mensagem: string;
  idpedido: number;
  idpessoa: number;
  dataPedido: string;
  statusPedido: string;
  valorTotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/api/Pedido`;

  cadastrarPedido(pedido: PedidoCriarDTO): Observable<PedidoResposta> {
    return this.http.post<PedidoResposta>(this.apiUrl, pedido);
  }

  listarPedidos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

atualizarStatus(
  idPedido: number,
  statusPedido: string
): Observable<{ mensagem: string; idpedido: number; statusPedido: string }> {

  return this.http.patch<{
    mensagem: string;
    idpedido: number;
    statusPedido: string;
  }>(
    `${this.apiUrl}/${idPedido}/status`,
    { statusPedido }
  );
}


}
