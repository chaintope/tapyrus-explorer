import { TestBed } from '@angular/core/testing';

import { BackendService } from './backend.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';

describe('BackendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
  });

  it('should be created', () => {
    const service: BackendService = TestBed.inject(BackendService);
    expect(service).toBeTruthy();
  });
});
