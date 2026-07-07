import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Matematicas } from './matematicas';

describe('Matematicas', () => {
  let component: Matematicas;
  let fixture: ComponentFixture<Matematicas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Matematicas],
    }).compileComponents();

    fixture = TestBed.createComponent(Matematicas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
