import { TestBed } from '@angular/core/testing';

import { FilesCreatorService } from './files-creator.service';

describe('FilesCreatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilesCreatorService = TestBed.get(FilesCreatorService);
    expect(service).toBeTruthy();
  });
});
