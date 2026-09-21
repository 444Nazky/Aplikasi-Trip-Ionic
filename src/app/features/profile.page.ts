import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonCard, IonCardContent, IonIcon, IonButton } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, IonContent, IonCard, IonCardContent, IonIcon, IonButton],
  template: `
    <ion-content class="ion-padding">
      <div class="profile-header">
        <ion-icon name="person-circle" class="avatar"></ion-icon>
        <h2>{{ user?.nama || 'Petugas' }}</h2>
        <span class="region-badge">
          <ion-icon name="location"></ion-icon>
          {{ user?.regionName || 'Region' }}
        </span>
      </div>

      <ion-card class="stats-card">
        <ion-card-content>
          <div class="stat-row">
            <span>Total Trip</span>
            <span class="value">{{ totalTrips }}</span>
          </div>
          <div class="stat-row">
            <span>Pending Sync</span>
            <span class="value" [class.warning]="pendingSync > 0">{{ pendingSync }}</span>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-button expand="block" color="danger" (click)="logout()">
        <ion-icon name="log-out" slot="start"></ion-icon>
        LOGOUT
      </ion-button>
    </ion-content>
  `,
  styles: [`
    .profile-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .avatar {
      font-size: 5rem;
      color: var(--ion-color-primary);
    }
    h2 { margin: 0.5rem 0 0; font-weight: 700; }
    .region-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      background: var(--ion-color-light);
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
    }
    .stats-card { --background: var(--bg-surface); border-radius: 16px; border: 1px solid var(--border-subtle); }
    .stat-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--border-subtle);
      &:last-child { border-bottom: none; }
    }
    .value { font-weight: 700; &.warning { color: var(--ion-color-warning); }
  `],
})
export class ProfilePage {
  user = { nama: 'Petugas', regionName: 'Badau' };
  totalTrips = 0;
  pendingSync = 0;

  logout() {
    // TODO: implement logout
  }
}
