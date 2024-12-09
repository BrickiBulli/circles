import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { GoogleMapsService } from '../services/google-maps.service';
import { GeolocationService } from '../services/geolocation.service';
import { GooglePlacesService } from '../services/google-places.service'; 
import { InfoGooglemapsPopupPage } from '../pages/info-googlemaps-popup/info-googlemaps-popup.page';  
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
  providers: [ModalController],
})
export class Tab1Page {
  private map!: GoogleMap;
  private infoPopup: HTMLElement | null = null;
  private markers: string[] = [];  

  constructor(
    private googleMapsService: GoogleMapsService,     
    private geolocationService: GeolocationService,
    private googlePlaceService: GooglePlacesService,
    private modalController: ModalController,
  ){}

  async ngOnInit() {
    const apiKey = this.googleMapsService.getApiKey();
    if (!apiKey) {
      console.error('Google Maps API key not found');
      return;
    }

    const userLocation = await this.geolocationService.getCurrentLocation();
    if (!userLocation) {
      console.error('Unable to retrieve user location');
      return;
    }
    this.initializeMap(apiKey, userLocation);
  }

  async initializeMap(apiKey: string, center: { lat: number; lng: number }) {
    const mapElement = document.getElementById('map');

    if (!mapElement) {
      console.error('Map element not found');
      return;
    }

    this.map = await GoogleMap.create({
      id: 'my-map',
      element: mapElement,
      apiKey: apiKey, 
      config: {
        center: center,
        zoom: 12,
        clickableIcons: false, 
      },
    });

    await this.map.setOnMapClickListener((event) => {
      const clickedLocation = {
        lat: event.latitude,
        lng: event.longitude,
      };
      this.getPlaceInfo(clickedLocation);
    });

    this.infoPopup = document.getElementById('info-popup');
  }

  async addMarker(center: { lat: number; lng: number }) {
    const marker: Marker = {
      coordinate: center,
      title: 'San Francisco',
      snippet: 'Welcome to SF!',
    };

    this.markers.push(await this.map.addMarker(marker)); 
  }

  async getPlaceInfo(location: { lat: number; lng: number }) {
    this.clearMarkers();
    this.addMarker(location);
    console.log("PlacInfo")
    try {
      const places = await this.googlePlaceService.getNearbyPlaces(location.lat, location.lng);

      console.log("Places", places)
      if (places.length > 1) {
        const place = places[1]; 
        const placeDetails = await this.googlePlaceService.getPlaceDetails(place.place_id);
        console.log(placeDetails)
        this.showInfoPopup(placeDetails);
      } else {
        if (this.infoPopup) {
          this.infoPopup.style.display = 'none';
        }
        console.log('No nearby places found');
      }
    } catch (error) {
      console.error('Error fetching place info:', error);
    }
  }

  async showInfoPopup(place: any) {
    const modal = await this.modalController.create({
      component: InfoGooglemapsPopupPage,
      componentProps: {
        place: place
      }
    });

    return await modal.present();
  }

  clearMarkers() {
    if (this.markers.length > 0) {
      for (const marker of this.markers) {
        this.map.removeMarker(marker)
      }
      this.markers = []; // Clear the markers array
    }
  }
}
