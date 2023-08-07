import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingValidationPage } from './tracking_validation.page';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TrackingVerificationPage', () => {
  let component: TrackingValidationPage;
  let fixture: ComponentFixture<TrackingValidationPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrackingValidationPage],
      imports: [RouterTestingModule, HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(TrackingValidationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
