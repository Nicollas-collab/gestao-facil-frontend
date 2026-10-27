import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntradasProdutos } from './entradas-produtos';

describe('EntradasProdutos', () => {
  let component: EntradasProdutos;
  let fixture: ComponentFixture<EntradasProdutos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntradasProdutos],
    }).compileComponents();

    fixture = TestBed.createComponent(EntradasProdutos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
