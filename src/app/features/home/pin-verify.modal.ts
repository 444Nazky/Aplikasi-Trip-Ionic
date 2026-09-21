import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonSpinner,
  ModalController,
} from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-pin-verify-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonButton, IonIcon, IonSpinner],
  template: `
    <ion-content class="pin-modal-content">
      <div class="pin-modal-wrap">
        <!-- Close button -->
        <div class="modal-close-bar">
          <button type="button" class="close-btn" (click)="dismiss(false)">
            <ion-icon name="close"></ion-icon>
          </button>
        </div>

        <!-- Header -->
        <div class="pin-header">
          <div class="lock-icon-circle">
            <ion-icon name="lock-closed"></ion-icon>
          </div>
          <h2 class="pin-title">Verifikasi PIN</h2>
          <p class="pin-subtitle">Masukkan PIN 6 digit untuk melanjutkan ganti petugas</p>
        </div>

        <!-- PIN dots -->
        <div class="pin-dots-row">
          <div *ngFor="let d of [0,1,2,3,4,5]"
               class="pin-dot"
               [class.filled]="pin.length > d"
               [class.error]="error">
          </div>
        </div>
        <p class="pin-error-text" *ngIf="error">{{ errorMsg }}</p>

        <!-- Hidden input for keyboard -->
        <input type="password" inputmode="numeric" maxlength="6"
               [(ngModel)]="pin" class="hidden-input"
               (keyup.enter)="verify()" />

        <!-- Numpad -->
        <div class="numpad-grid">
          <button *ngFor="let num of [1,2,3,4,5,6,7,8,9]"
                  type="button" class="numpad-btn" (click)="pressKey(num.toString())">
            {{ num }}
          </button>
          <div class="numpad-empty"></div>
          <button type="button" class="numpad-btn" (click)="pressKey('0')">0</button>
          <button type="button" class="numpad-btn backspace-btn" (click)="pressBack()">
            <ion-icon name="backspace-outline"></ion-icon>
          </button>
        </div>

        <!-- Verify Button -->
        <ion-button expand="block" class="verify-btn"
                    [disabled]="loading || pin.length !== 6"
                    (click)="verify()">
          <ion-spinner *ngIf="loading" name="crescent" class="btn-spinner"></ion-spinner>
          <span *ngIf="!loading">Verifikasi</span>
        </ion-button>
      </div>
    </ion-content>
  `,
  styles: [`
    .pin-modal-content {
      --background: #f8fafc;
    }
    .pin-modal-wrap {
      padding: 12px 20px calc(24px + env(safe-area-inset-bottom));
      min-height: 100%;
      display: flex;
      flex-direction: column;
    }
    .modal-close-bar {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 4px;
    }
    .close-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      ion-icon { font-size: 18px; color: #64748b; }
      &:active { background: #e2e8f0; }
    }
    .pin-header { text-align: center; margin-bottom: 28px; }
    .lock-icon-circle {
      width: 56px; height: 56px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      border-radius: 18px;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 14px;
      box-shadow: 0 6px 16px rgba(37,99,235,0.3);
      ion-icon { font-size: 26px; color: #fff; }
    }
    .pin-title {
      font-size: 20px; font-weight: 800; color: #0f172a;
      margin: 0 0 6px; letter-spacing: -0.01em;
    }
    .pin-subtitle {
      font-size: 13px; color: #64748b; margin: 0;
    }
    .pin-dots-row {
      display: flex; justify-content: center; gap: 14px; margin-bottom: 8px;
    }
    .pin-dot {
      width: 16px; height: 16px; border-radius: 50%;
      background: #f1f5f9; border: 2px solid #cbd5e1;
      transition: all 0.18s cubic-bezier(0.4,0,0.2,1);
      &.filled {
        background: #10b981; border-color: #059669;
        box-shadow: 0 0 10px rgba(16,185,129,0.45);
        transform: scale(1.15);
      }
      &.error {
        background: #ef4444; border-color: #dc2626;
        box-shadow: 0 0 10px rgba(239,68,68,0.45);
        animation: shake 0.3s ease-in-out;
      }
    }
    .pin-error-text {
      text-align: center; font-size: 12px; font-weight: 600;
      color: #ef4444; margin: 4px 0 0;
    }
    .hidden-input {
      position: absolute; opacity: 0; width: 1px; height: 1px; pointer-events: none;
    }
    .numpad-grid {
      display: grid; grid-template-columns: repeat(3,1fr);
      gap: 12px; max-width: 270px; width: 100%; margin: 24px auto 20px;
    }
    .numpad-btn {
      width: 64px; height: 64px; border-radius: 20px;
      background: #fff; border: 1px solid #e2e8f0;
      font-size: 22px; font-weight: 700; color: #0f172a;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      justify-self: center; box-shadow: 0 2px 6px rgba(15,23,42,0.04);
      transition: all 0.12s ease; user-select: none;
      &:active {
        background: #2563eb; border-color: #2563eb; color: #fff;
        transform: scale(0.93); box-shadow: 0 4px 12px rgba(37,99,235,0.3);
      }
      &.backspace-btn {
        background: #f8fafc; border-color: #e2e8f0; color: #64748b; box-shadow: none;
        ion-icon { font-size: 22px; }
        &:active { color: #ef4444; background: #fee2e2; border-color: #fca5a5; }
      }
    }
    .numpad-empty { width: 64px; height: 64px; }
    .verify-btn {
      --background: #2563eb; --background-hover: #1d4ed8;
      --background-activated: #1e40af; --color: #fff;
      --border-radius: 16px; height: 50px; font-size: 15px;
      font-weight: 700; margin-top: auto;
      --box-shadow: 0 4px 14px rgba(37,99,235,0.3);
      &:disabled {
        --background: #e2e8f0; --color: #94a3b8; --box-shadow: none; opacity: 0.8;
      }
    }
    .btn-spinner { --color: #fff; }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-6px); }
      40%, 80% { transform: translateX(6px); }
    }
  `],
})
export class PinVerifyModal implements OnInit {
  pin = '';
  loading = false;
  error = false;
  errorMsg = '';

  constructor(
    private modalCtrl: ModalController,
    private auth: AuthService
  ) {}

  ngOnInit(): void {}

  pressKey(key: string): void {
    this.error = false;
    if (this.pin.length < 6) {
      this.pin += key;
      if (this.pin.length === 6) {
        this.verify();
      }
    }
  }

  pressBack(): void {
    this.error = false;
    this.pin = this.pin.slice(0, -1);
  }

  async verify(): Promise<void> {
    if (this.pin.length !== 6) return;
    this.loading = true;
    this.error = false;
    const result = await this.auth.login(this.pin);
    this.loading = false;
    if (result.success) {
      this.modalCtrl.dismiss({ verified: true }, 'verified');
    } else {
      this.error = true;
      this.errorMsg = result.message ?? 'PIN tidak valid. Coba lagi.';
      this.pin = '';
    }
  }

  dismiss(valid: boolean): void {
    this.modalCtrl.dismiss({ verified: valid }, valid ? 'verified' : 'cancel');
  }
}
