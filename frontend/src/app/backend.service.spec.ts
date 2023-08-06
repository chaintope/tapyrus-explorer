import { TestBed } from '@angular/core/testing';

import { BackendService } from './backend.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BackendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', () => {
    const service: BackendService = TestBed.inject(BackendService);
    expect(service).toBeTruthy();
  });
});
