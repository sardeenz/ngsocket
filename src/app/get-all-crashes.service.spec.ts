import { TestBed, inject } from '@angular/core/testing';

import { GetAllCrashesService } from './get-all-crashes.service';

describe('GetAllCrashesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetAllCrashesService]
    });
  });

  it('should be created', inject([GetAllCrashesService], (service: GetAllCrashesService) => {
    expect(service).toBeTruthy();
  }));
});
