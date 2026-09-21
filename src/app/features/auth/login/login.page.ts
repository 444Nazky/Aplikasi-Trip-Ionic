import { Component } from '@angular/core';
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
  pin = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastController
  ) {}

  pressKey(key: string): void {
    if (this.pin.length < 6) {
      this.pin += key;
    }
  }

  pressBackspace(): void {
    this.pin = this.pin.slice(0, -1);
  }

  async login(): Promise<void> {
    if (this.pin.length !== 6) {
      await this.showToast('Masukkan PIN 6 digit');
      return;
    }
    this.loading = true;
    const result = await this.auth.login(this.pin);
    this.loading = false;
    if (result.success) {
      this.router.navigate(['/tabs/home'], { replaceUrl: true });
    } else {
      await this.showToast(result.message ?? 'Login gagal');
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
