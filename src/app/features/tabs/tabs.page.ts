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
      --background: #ffffff;
      --border: none;
      height: 68px;
      padding: 6px 16px;
      padding-bottom: calc(6px + env(safe-area-inset-bottom, 0px));
      box-shadow: 0 -4px 16px rgba(15, 23, 42, 0.05);
      border-top: 1px solid #e2e8f0;

      &::before {
        display: none;
      }
    }

    .pill-tab {
      --color: #64748b;
      --color-selected: #2563eb;
      --indicator-color: transparent;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.01em;
      border-radius: 14px;
      padding: 4px 8px;
      transition: all 0.18s ease;

      ion-icon {
        font-size: 22px;
        margin-bottom: 2px;
      }

      &[aria-selected="true"] {
        background: #eff6ff;
        color: #2563eb;
        font-weight: 700;
      }
    }
  `],
})
export class TabsPage {}
