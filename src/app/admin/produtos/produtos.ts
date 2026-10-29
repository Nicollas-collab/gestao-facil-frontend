import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { ItemServicos } from '../../servicos/item.servicos';
import { Item } from '../../models/item';

registerLocaleData(localePt);

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css'
})
export class Produtos implements OnInit {
  itens: Item[] = [];
  carregando = false;
  erro = '';

  constructor(private itemServicos: ItemServicos) {}

  ngOnInit(): void {
    this.listarItens();
  }

  listarItens(): void {
    this.carregando = true;
    this.erro = '';
  
    this.itemServicos.listarItens().subscribe({
      next: (dados: Item[]) => {
        console.log('Total de itens recebidos:', dados.length);
        console.log('Itens recebidos:', dados);
  
        this.itens = dados;
        this.carregando = false;
      },
      error: (erro: any) => {
        console.error('Erro ao carregar itens:', erro);
        this.erro = 'Não foi possível carregar os produtos e serviços.';
        this.carregando = false;
      }
    });
  }}
