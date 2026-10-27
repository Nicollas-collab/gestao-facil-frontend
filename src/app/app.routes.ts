
import { Routes } from '@angular/router';

// Loja virtual
import { CatalogoComponent } from './pages/loja/catalogo/catalogo.component';
import { CadastroClienteComponent } from './pages/loja/cadastro-cliente/cadastro-cliente.component';
import { CarrinhoComponent } from './pages/loja/carrinho/carrinho.component';
import { MeusPedidosComponent } from './pages/loja/meus-pedidos/meus-pedidos.component';
import { DetalhesPedidoComponent } from './pages/loja/detalhes-pedido/detalhes-pedido.component';

// Painel administrativo
import { DashboardComponent } from 'admin/dashboard/dashboard.component';
import { ClientesComponent } from 'admin/clientes/clientes.component';
import { ProdutosComponent } from 'admin/produtos/produtos.component';
import { ServicosComponent } from 'admin/servicos/servicos.component';
import { CategoriasComponent } from 'admin/categorias/categorias.component';
import { FuncionariosComponent } from 'admin/funcionarios/funcionarios.component';
import { PedidosComponent } from 'admin/pedidos/pedidos.component';
import { EstoqueComponent } from 'admin/estoque/estoque.component';
import { EntradasProdutosComponent } from 'admin/entradas-produtos/entradas-produtos.component';

export const routes: Routes = [
  // Loja virtual
  { path: '', component: CatalogoComponent },
  { path: 'cadastro-cliente', component: CadastroClienteComponent },
  { path: 'carrinho', component: CarrinhoComponent },
  { path: 'meus-pedidos', component: MeusPedidosComponent },
  { path: 'pedidos/:id', component: DetalhesPedidoComponent },

  // Painel administrativo
  { path: 'admin', component: DashboardComponent },
  { path: 'admin/clientes', component: ClientesComponent },
  { path: 'admin/produtos', component: ProdutosComponent },
  { path: 'admin/servicos', component: ServicosComponent },
  { path: 'admin/categorias', component: CategoriasComponent },
  { path: 'admin/funcionarios', component: FuncionariosComponent },
  { path: 'admin/pedidos', component: PedidosComponent },
  { path: 'admin/estoque', component: EstoqueComponent },
  { path: 'admin/entradas-produtos', component: EntradasProdutosComponent },

  // Redirecionamento de caminhos desconhecidos
  { path: '**', redirectTo: '' }
];
