import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonButton,
} from '@ionic/angular';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton],
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage {
  appVersion = '1.0.0';
  capacitorVersion = '7.6.9';
  angularVersion = '22.1.7';
  ionicVersion = '9.0.0';

  openGitHub(): void {
    window.open('https://github.com/444Nazky/Aplikasi-Trip-Ionic', '_blank');
  }
}
