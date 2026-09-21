import { Component } from '@angular/core';
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom" class="pill-tab-bar">
        <ion-tab-button tab="home" class="pill-tab">
          <ion-icon name="home"></ion-icon>
          <ion-label>Home</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="history" class="pill-tab">
          <ion-icon name="list"></ion-icon>
          <ion-label>Riwayat</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="profile" class="pill-tab">
          <ion-icon name="person"></ion-icon>
          <ion-label>Profil</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: [`
    .pill-tab-bar {
      --background: var(--color-surface);
      --border: none;
      height: 72px;
      padding: 8px 16px;
      padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
      box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.05);
      border-top: 1px solid var(--color-border-light);

      &::before {
        display: none;
      }
    }

    .pill-tab {
      --color: var(--color-text-muted);
      --color-selected: var(--ion-color-primary);
      --indicator-color: transparent;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.02em;
      max-width: 80px;
      border-radius: 12px;
      padding: 4px 0;
      transition: all 0.2s ease;

      ion-icon {
        font-size: 22px;
        margin-bottom: 2px;
      }

      &[aria-selected="true"] {
        background: rgba(var(--ion-color-primary-rgb), 0.08);
      }
    }
  `],
})
export class TabsPage {}
