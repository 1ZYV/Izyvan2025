import { TestBed } from '@angular/core/testing';

import { TransportProvidersServiceService } from './transport-providers-service.service';

describe('TransportProvidersServiceService', () => {
  let service: TransportProvidersServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransportProvidersServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
