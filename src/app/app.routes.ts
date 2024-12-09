import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'info-googlemaps-popup',
    loadComponent: () => import('./pages/info-googlemaps-popup/info-googlemaps-popup.page').then( m => m.InfoGooglemapsPopupPage)
  },
];
