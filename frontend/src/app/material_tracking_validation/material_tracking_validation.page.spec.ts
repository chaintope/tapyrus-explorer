import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialTrackingValidationPage } from './material_tracking_validation.page';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MaterialTrackingVerificationPage', () => {
  let component: MaterialTrackingValidationPage;
  let fixture: ComponentFixture<MaterialTrackingValidationPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialTrackingValidationPage],
      imports: [RouterTestingModule, HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(MaterialTrackingValidationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
