import { Routes } from '@angular/router';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    canActivate: [AuthGuard],
  },
  {
    path: 'info-googlemaps-popup',
    loadComponent: () =>
      import('./pages/info-googlemaps-popup/info-googlemaps-popup.page').then(
        (m) => m.InfoGooglemapsPopupPage
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'chat/:id',
    loadComponent: () => import('./pages/chat/chat.page').then((m) => m.ChatPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'create-chatroom',
    loadComponent: () => import('./pages/create-chatroom/create-chatroom.page').then( m => m.CreateChatroomPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-users/:id',
    loadComponent: () => import('./pages/add-users/add-users.page').then( m => m.AddUsersPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-chatroom/:id',
    loadComponent: () => import('./pages/edit-chatroom/edit-chatroom.page').then( m => m.EditChatroomPage),
    canActivate: [AuthGuard],
  },




];
