import { TestBed } from '@angular/core/testing';

import { WeatherPlaylist } from './issue.service';

describe('IssueService', () => {
  let service: WeatherPlaylist;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherPlaylist);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
