import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalhesPedidos } from './detalhes-pedidos';

describe('DetalhesPedidos', () => {
  let component: DetalhesPedidos;
  let fixture: ComponentFixture<DetalhesPedidos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesPedidos],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalhesPedidos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
