import { TestBed } from '@angular/core/testing';

import { SupabaseChatroomsService } from './supabase-chatrooms.service';

describe('SupabaseChatroomsService', () => {
  let service: SupabaseChatroomsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupabaseChatroomsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
