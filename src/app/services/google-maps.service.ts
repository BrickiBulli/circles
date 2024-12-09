import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  private apiKey: string;

  constructor() {
    this.apiKey = environment.googleApiKey;
  }

  getApiKey(): string {
    return this.apiKey;
  }
}
