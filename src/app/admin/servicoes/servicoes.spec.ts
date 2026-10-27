import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Servicoes } from './servicoes';

describe('Servicoes', () => {
  let component: Servicoes;
  let fixture: ComponentFixture<Servicoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Servicoes],
    }).compileComponents();

    fixture = TestBed.createComponent(Servicoes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
