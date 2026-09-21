import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home.page').then((m) => m.HomePage),
  },
  {
    path: 'history',
    loadComponent: () => import('./history.page').then((m) => m.HistoryPage),
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile.page').then((m) => m.ProfilePage),
  },
];
