import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GooglePlacesService {
  private apiKey: string;

  constructor() {
    this.apiKey = environment.googleApiKey;
  }

  // Use CORS proxy for development
  private corsProxyUrl: string = 'https://cors-anywhere.herokuapp.com/';

  async getNearbyPlaces(lat: number, lng: number, radius: number = 10) {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&key=${this.apiKey}`;
    const proxiedUrl = this.corsProxyUrl + url;
  
    try {
      const response = await fetch(proxiedUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch nearby places');
      }
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      throw new Error('Failed to fetch nearby places');
    }
  }

  async getPlaceDetails(placeId: string) {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${this.apiKey}`;
    const proxiedUrl = this.corsProxyUrl + url;

    try {
      const response = await fetch(proxiedUrl);
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching place details:', error);
      throw new Error('Failed to fetch place details');
    }
  }
}