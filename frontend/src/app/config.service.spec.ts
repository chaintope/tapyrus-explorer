import { TestBed } from '@angular/core/testing';

import { ConfigService } from './config.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ConfigService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
  );

  it('should be created', () => {
    const service: ConfigService = TestBed.inject(ConfigService);
    expect(service).toBeTruthy();
  });
});
