import { TestBed } from '@angular/core/testing';
import { EstoqueServicos } from './estoque.servicos';

describe('EstoqueServicos', () => {
  let service: EstoqueServicos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstoqueServicos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
