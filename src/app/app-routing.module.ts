import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
  {
    path: 'splash',
    loadComponent: () => import('./features/auth/splash/splash.page').then((m) => m.SplashPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.page.tsx').then((m) => m.LoginPage),
  },
  {
    path: 'tabs',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.page.tsx').then((m) => m.HomePage),
      },
      {
        path: 'history',
        loadComponent: () => import('./features/history/history.page.tsx').then((m) => m.HistoryPage),
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.page.tsx').then((m) => m.ProfilePage),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  {
    path: 'create-trip',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/trip/create-trip/create-trip.page.tsx').then((m) => m.CreateTripPage),
  },
  {
    path: 'input-vehicle',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/trip/input-vehicle/input-vehicle.page.tsx').then((m) => m.InputVehiclePage),
  },
  {
    path: 'success/:id',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/trip/success-dialog/success-dialog.page.tsx').then((m) => m.SuccessDialogPage),
  },
  {
    path: 'trip-detail/:id',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/trip/trip-detail/trip-detail.page.tsx').then((m) => m.TripDetailPage),
  },
  { path: '**', redirectTo: 'splash' },
];
