import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimescalePicker } from './timescale-picker';

describe('TimescalePicker', () => {
  let component: TimescalePicker;
  let fixture: ComponentFixture<TimescalePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimescalePicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimescalePicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
