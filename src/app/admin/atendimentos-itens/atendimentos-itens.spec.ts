import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AtendimentosItens } from './atendimentos-itens';

describe('AtendimentosItens', () => {
  let component: AtendimentosItens;
  let fixture: ComponentFixture<AtendimentosItens>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtendimentosItens],
    }).compileComponents();

    fixture = TestBed.createComponent(AtendimentosItens);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
