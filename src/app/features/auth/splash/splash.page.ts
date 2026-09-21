import { Component, OnInit } from '@angular/core';
import { IonContent, IonSpinner } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [IonContent, IonSpinner],
  template: `
    <ion-content class="splash">
      <div class="splash-bg"></div>
      <div class="splash-inner">
        <div class="brand-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="16" fill="rgba(255,255,255,0.15)"/>
            <path d="M18 44L26 20H30L38 44" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20 38H36" stroke="white" stroke-width="3" stroke-linecap="round"/>
            <circle cx="46" cy="26" r="4" stroke="white" stroke-width="2.5"/>
            <path d="M42 44V30" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </div>
        <h1 class="brand-title">Trip Angkutan</h1>
        <p class="brand-subtitle">Sistem Pencatatan Angkutan</p>
        <div class="splash-loader">
          <ion-spinner name="dots"></ion-spinner>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .splash {
      --background: linear-gradient(160deg, #0F5132 0%, #0A3D26 50%, #064E3B 100%);
    }

    .splash-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background:
        radial-gradient(circle at 20% 30%, rgba(16,185,129,0.12) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(245,158,11,0.06) 0%, transparent 40%);
      pointer-events: none;
    }

    .splash-inner {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      gap: 16px;
      padding: 0 32px;
    }

    .brand-icon {
      width: 96px;
      height: 96px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
      animation: fadeInUp 0.6s ease-out;
    }

    .brand-title {
      font-size: 28px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.03em;
      margin: 0;
      animation: fadeInUp 0.6s ease-out 0.1s both;
    }

    .brand-subtitle {
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.6);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin: 0;
      animation: fadeInUp 0.6s ease-out 0.2s both;
    }

    .splash-loader {
      margin-top: 32px;
      animation: fadeInUp 0.6s ease-out 0.3s both;

      ion-spinner {
        --color: rgba(255, 255, 255, 0.5);
        width: 28px;
        height: 28px;
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
})
export class SplashPage implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    const loggedIn = await this.auth.restoreSession();
    setTimeout(() => {
      this.router.navigateByUrl(loggedIn ? '/tabs/home' : '/login', { replaceUrl: true });
    }, 1000);
  }
}
