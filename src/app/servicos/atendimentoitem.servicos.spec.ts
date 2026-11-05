import { TestBed } from '@angular/core/testing';
import { AtendimentoitemServicos } from './atendimentoitem.servicos';

describe('AtendimentoitemServicos', () => {
  let service: AtendimentoitemServicos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtendimentoitemServicos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
