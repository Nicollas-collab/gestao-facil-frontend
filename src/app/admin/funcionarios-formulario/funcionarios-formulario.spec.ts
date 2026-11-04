import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuncionariosFormulario } from './funcionarios-formulario';

describe('FuncionariosFormulario', () => {
  let component: FuncionariosFormulario;
  let fixture: ComponentFixture<FuncionariosFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionariosFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(FuncionariosFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
