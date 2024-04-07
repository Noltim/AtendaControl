import { TestBed } from '@angular/core/testing';

import { SenhasService } from './senhas.service';

describe('SenhasService', () => {
  let service: SenhasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SenhasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
