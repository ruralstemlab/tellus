import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ciencias } from './ciencias';

describe('Ciencias', () => {
  let component: Ciencias;
  let fixture: ComponentFixture<Ciencias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ciencias],
    }).compileComponents();

    fixture = TestBed.createComponent(Ciencias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
