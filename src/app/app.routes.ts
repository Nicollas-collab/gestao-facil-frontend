
import { Routes } from '@angular/router';

// Loja virtual
import { Catalogo } from './loja/catalogo/catalogo';
import { CadastroCliente } from './loja/cadastro-cliente/cadastro-cliente';
import { Carrinho } from './loja/carrinho/carrinho';
import { MeusPedidos } from './loja/meus-pedidos/meus-pedidos';
import { DetalhesPedidos } from './loja/detalhes-pedidos/detalhes-pedidos';

// Painel administrativo
import { Dashboard } from './admin/dashboard/dashboard';
import { Clientes } from './admin/clientes/clientes';
import { Produtos } from './admin/produtos/produtos';
import { Servicoes } from './admin/servicoes/servicoes';
import { Categorias } from './admin/categorias/categorias';
import { Funcionarios } from './admin/funcionarios/funcionarios';
import { Pedidos } from './admin/pedidos/pedidos';
import { Estoque } from './admin/estoque/estoque';
import { EntradasProdutos } from './admin/entradas-produtos/entradas-produtos';

export const routes: Routes = [
  // Loja virtual
  { path: '', component: Catalogo },
  { path: 'cadastro-cliente', component: CadastroCliente },
  { path: 'carrinho', component: Carrinho },
  { path: 'meus-pedidos', component: MeusPedidos },
  { path: 'pedidos/:id', component: DetalhesPedidos },

  // Painel administrativo
  { path: 'admin', component: Dashboard },
  { path: 'admin/clientes', component: Clientes },
  { path: 'admin/produtos', component: Produtos },
  { path: 'admin/servicos', component: Servicoes },
  { path: 'admin/categorias', component: Categorias },
  { path: 'admin/funcionarios', component: Funcionarios },
  { path: 'admin/pedidos', component: Pedidos },
  { path: 'admin/estoque', component: Estoque },
  { path: 'admin/entradas-produtos', component: EntradasProdutos },

  { path: '**', redirectTo: '' }
];
