import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialTrackingValidationPage } from './material_tracking_validation.page';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';

describe('MaterialTrackingVerificationPage', () => {
  let component: MaterialTrackingValidationPage;
  let fixture: ComponentFixture<MaterialTrackingValidationPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialTrackingValidationPage],
      imports: [RouterTestingModule],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    fixture = TestBed.createComponent(MaterialTrackingValidationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
