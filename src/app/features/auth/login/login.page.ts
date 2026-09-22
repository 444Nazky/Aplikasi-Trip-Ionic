import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ToastController,
  IonContent,
  IonButton,
  IonSpinner,
  IonIcon,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonButton, IonSpinner, IonIcon],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastController);

  pin = '';
  loading = false;
  error = false;
  errorMessage = '';

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join('');
  }

  pressKey(key: string): void {
    this.error = false;
    if (this.pin.length < 6) {
      this.pin += key;
      if (this.pin.length === 6) {
        this.login();
      }
    }
  }

  pressBackspace(): void {
    this.error = false;
    this.pin = this.pin.slice(0, -1);
  }

  async login(): Promise<void> {
    if (this.pin.length !== 6) {
      await this.showToast('Masukkan PIN 6 digit');
      return;
    }
    this.loading = true;
    this.error = false;
    const result = await this.auth.login(this.pin);
    this.loading = false;
    if (result.success) {
      this.router.navigate(['/tabs/home'], { replaceUrl: true });
    } else {
      this.error = true;
      this.errorMessage = result.message ?? 'PIN tidak valid. Coba lagi.';
      await this.showToast(this.errorMessage);
      this.pin = '';
    }
  }

  private async showToast(message: string): Promise<void> {
    const t = await this.toast.create({
      message,
      duration: 2500,
      color: 'danger',
    });
    await t.present();
  }
}
