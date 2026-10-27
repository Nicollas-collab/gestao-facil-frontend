import { TestBed } from '@angular/core/testing';
import { EntradaProduto } from './entrada-produto';

describe('EntradaProduto', () => {
  let service: EntradaProduto;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntradaProduto);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
