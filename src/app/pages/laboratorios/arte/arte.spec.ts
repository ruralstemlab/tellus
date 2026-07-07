import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Arte } from './arte';

describe('Arte', () => {
  let component: Arte;
  let fixture: ComponentFixture<Arte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Arte],
    }).compileComponents();

    fixture = TestBed.createComponent(Arte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
