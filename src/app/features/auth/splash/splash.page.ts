import { Component, OnInit } from '@angular/core';
import { IonContent, IonSpinner } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [IonContent, IonSpinner],
  template: `
    <ion-content class="ion-padding ion-text-center splash">
      <div class="splash-inner">
        <h1>TRIP ANGKUTAN</h1>
        <ion-spinner name="crescent"></ion-spinner>
      </div>
    </ion-content>
  `,
  styles: [
    `.splash { display: flex; align-items: center; justify-content: center; }
     .splash-inner { display: flex; flex-direction: column; gap: 16px; align-items: center; }`,
  ],
})
export class SplashPage implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    const loggedIn = await this.auth.restoreSession();
    setTimeout(() => {
      this.router.navigateByUrl(loggedIn ? '/tabs/home' : '/login', { replaceUrl: true });
    }, 800);
  }
}
