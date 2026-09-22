import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonSpinner,
} from '@ionic/angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonInput, IonButton, IonSpinner],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  pin = '';
  loading = false;

  onPinChange(value: string): void {
    this.pin = value;
  }

  async login(): Promise<void> {
    if (this.pin.length !== 6 || this.loading) return;
    this.loading = true;
    // TODO: implement login logic
    this.loading = false;
  }
}
