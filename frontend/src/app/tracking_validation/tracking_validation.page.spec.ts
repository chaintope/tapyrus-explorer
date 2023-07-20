import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingValidationPage } from './tracking_validation.page';

describe('TrackingVerificationPage', () => {
  let component: TrackingValidationPage;
  let fixture: ComponentFixture<TrackingValidationPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrackingValidationPage]
    });
    fixture = TestBed.createComponent(TrackingValidationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
