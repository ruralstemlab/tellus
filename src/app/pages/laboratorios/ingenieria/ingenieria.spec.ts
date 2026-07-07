import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ingenieria } from './ingenieria';

describe('Ingenieria', () => {
  let component: Ingenieria;
  let fixture: ComponentFixture<Ingenieria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ingenieria],
    }).compileComponents();

    fixture = TestBed.createComponent(Ingenieria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
