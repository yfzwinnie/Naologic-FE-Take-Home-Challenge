import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaretIcon } from './caret-icon';

describe('CaretIcon', () => {
  let component: CaretIcon;
  let fixture: ComponentFixture<CaretIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaretIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaretIcon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
