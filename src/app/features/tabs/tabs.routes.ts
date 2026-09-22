import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page.tsx').then((m) => m.HomePage),
  },
  {
    path: 'history',
    loadComponent: () => import('./history/history.page.tsx').then((m) => m.HistoryPage),
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page.tsx').then((m) => m.ProfilePage),
  },
];
