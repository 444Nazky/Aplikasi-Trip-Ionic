import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonCard, IonCardContent, IonIcon, IonButton } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  personCircle, 
  location, 
  logOut, 
  navigate, 
  sync, 
  chevronForward,
  settingsOutline,
  shieldCheckmarkOutline,
  helpCircleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, IonContent, IonCard, IonCardContent, IonIcon, IonButton],
  template: `
    <ion-content class="ion-padding" [fullscreen]="true">
      <!-- Decorative gradient header background -->
      <div class="header-backdrop"></div>

      <!-- Profile Header -->
      <div class="profile-header">
        <div class="avatar-wrapper">
          <div class="avatar-ring">
            <ion-icon name="person-circle" class="avatar"></ion-icon>
          </div>
          <span class="status-dot" [class.online]="true"></span>
        </div>
        <h2>{{ user?.nama || 'Petugas' }}</h2>
        <span class="region-badge">
          <ion-icon name="location"></ion-icon>
          {{ user?.regionName || 'Region' }}
        </span>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon trip-icon">
            <ion-icon name="navigate"></ion-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ totalTrips }}</span>
            <span class="stat-label">Total Trip</span>
          </div>
        </div>

        <div class="stat-card" [class.has-pending]="pendingSync > 0">
          <div class="stat-icon sync-icon">
            <ion-icon name="sync" [class.spinning]="pendingSync > 0"></ion-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value" [class.warning]="pendingSync > 0">{{ pendingSync }}</span>
            <span class="stat-label">Pending Sync</span>
          </div>
          <span class="pending-badge" *ngIf="pendingSync > 0">{{ pendingSync }}</span>
        </div>
      </div>

      <!-- Menu Section -->
      <div class="menu-section">
        <div class="menu-item">
          <div class="menu-icon">
            <ion-icon name="settings-outline"></ion-icon>
          </div>
          <span class="menu-label">Pengaturan</span>
          <ion-icon name="chevron-forward" class="menu-arrow"></ion-icon>
        </div>

        <div class="menu-item">
          <div class="menu-icon">
            <ion-icon name="shield-checkmark-outline"></ion-icon>
          </div>
          <span class="menu-label">Keamanan</span>
          <ion-icon name="chevron-forward" class="menu-arrow"></ion-icon>
        </div>

        <div class="menu-item">
          <div class="menu-icon">
            <ion-icon name="help-circle-outline"></ion-icon>
          </div>
          <span class="menu-label">Bantuan</span>
          <ion-icon name="chevron-forward" class="menu-arrow"></ion-icon>
        </div>
      </div>

      <!-- Logout Button -->
      <ion-button expand="block" class="logout-btn" (click)="logout()">
        <ion-icon name="log-out" slot="start"></ion-icon>
        Keluar
      </ion-button>

      <div class="app-version">Versi 1.0.0</div>
    </ion-content>
  `,
  styles: [`
    ion-content {
      --background: var(--ion-background-color, #f8f9fc);
    }

    /* Decorative gradient header */
    .header-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 180px;
      background: linear-gradient(135deg, var(--ion-color-primary) 0%, var(--ion-color-primary-shade) 100%);
      border-radius: 0 0 32px 32px;
      z-index: 0;
    }

    /* Profile Header */
    .profile-header {
      position: relative;
      z-index: 1;
      text-align: center;
      padding: 1.5rem 0 2rem;
    }

    .avatar-wrapper {
      position: relative;
      display: inline-block;
      margin-bottom: 1rem;
    }

    .avatar-ring {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .avatar {
      font-size: 4rem;
      color: #ffffff;
    }

    .status-dot {
      position: absolute;
      bottom: 4px;
      right: 4px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #94a3b8;
      border: 3px solid #ffffff;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);

      &.online {
        background: var(--ion-color-success, #22c55e);
      }
    }

    .profile-header h2 {
      margin: 0.5rem 0 0.5rem;
      font-weight: 700;
      font-size: 1.4rem;
      color: #ffffff;
      letter-spacing: -0.02em;
    }

    .region-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      padding: 0.35rem 0.9rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 500;
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    /* Stats Grid */
    .stats-grid {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.85rem;
      margin-top: -0.5rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      position: relative;
      background: var(--bg-surface, #ffffff);
      border-radius: 20px;
      padding: 1.25rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      border: 1px solid var(--border-subtle, rgba(0, 0, 0, 0.05));
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:active {
        transform: scale(0.97);
      }

      &.has-pending {
        border-color: rgba(245, 158, 11, 0.3);
        box-shadow: 0 4px 20px rgba(245, 158, 11, 0.12);
      }
    }

    .stat-icon {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;

      &.trip-icon {
        background: rgba(99, 102, 241, 0.12);
        color: var(--ion-color-primary);
      }

      &.sync-icon {
        background: rgba(34, 197, 94, 0.12);
        color: var(--ion-color-success, #22c55e);
      }
    }

    .stat-info {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--ion-text-color, #1e293b);
      line-height: 1;
      letter-spacing: -0.03em;

      &.warning {
        color: var(--ion-color-warning, #f59e0b);
      }
    }

    .stat-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--ion-color-medium, #64748b);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .pending-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: var(--ion-color-warning, #f59e0b);
      color: #ffffff;
      font-size: 0.65rem;
      font-weight: 700;
      min-width: 20px;
      height: 20px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 6px;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .spinning {
      animation: spin 1.5s linear infinite;
    }

    /* Menu Section */
    .menu-section {
      background: var(--bg-surface, #ffffff);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      border: 1px solid var(--border-subtle, rgba(0, 0, 0, 0.05));
      margin-bottom: 1.5rem;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      cursor: pointer;
      transition: background 0.2s ease;

      &:not(:last-child) {
        border-bottom: 1px solid var(--border-subtle, rgba(0, 0, 0, 0.05));
      }

      &:active {
        background: rgba(0, 0, 0, 0.03);
      }
    }

    .menu-icon {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: rgba(99, 102, 241, 0.1);
      color: var(--ion-color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .menu-label {
      flex: 1;
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--ion-text-color, #1e293b);
    }

    .menu-arrow {
      color: var(--ion-color-medium, #94a3b8);
      font-size: 1.1rem;
    }

    /* Logout Button */
    .logout-btn {
      --background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      --background-hover: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      --border-radius: 16px;
      --box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
      --color: #ffffff;
      font-weight: 600;
      height: 52px;
      margin: 0;
      text-transform: none;
      letter-spacing: 0;
    }

    .app-version {
      text-align: center;
      font-size: 0.7rem;
      color: var(--ion-color-medium, #94a3b8);
      margin-top: 1.25rem;
      padding-bottom: 1rem;
    }
  `],
})
export class ProfilePage {
  user = { nama: 'Petugas', regionName: 'Badau' };
  totalTrips = 0;
  pendingSync = 0;

  constructor() {
    addIcons({
      personCircle,
      location,
      logOut,
      navigate,
      sync,
      chevronForward,
      settingsOutline,
      shieldCheckmarkOutline,
      helpCircleOutline,
    });
  }

  logout() {
  }
}