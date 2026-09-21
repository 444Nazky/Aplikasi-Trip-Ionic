import { Component } from '@angular/core';
import { ToastController, IonContent, IonInput, IonButton, IonSpinner } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonContent, IonInput, IonButton, IonSpinner],
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
    }
  }

  private async showToast(message: string): Promise<void> {
    const t = await this.toast.create({ message, duration: 2500, color: 'danger' });
    await t.present();
  }
}