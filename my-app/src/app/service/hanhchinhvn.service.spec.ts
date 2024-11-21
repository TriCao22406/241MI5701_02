import { TestBed } from '@angular/core/testing';

import { HanhchinhvnService } from './hanhchinhvn.service';

describe('HanhchinhvnService', () => {
  let service: HanhchinhvnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HanhchinhvnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
