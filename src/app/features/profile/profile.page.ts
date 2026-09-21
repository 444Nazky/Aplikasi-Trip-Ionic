import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AlertController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonNote,
  IonButton,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';
import { SyncService } from '../../core/services/sync.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonNote,
    IonButton,
  ],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userName = '';
  regionName = '';
  totalTrips = 0;
  pendingSync = 0;

  constructor(
    private auth: AuthService,
    private storage: StorageService,
    private sync: SyncService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit(): Promise<void> {
    const user = this.auth.currentUser;
    this.userName = user?.nama ?? '';
    this.regionName = user?.regionName ?? '';
    this.totalTrips = (await this.storage.getAllTrips()).length;
    this.pendingSync = await this.sync.pendingCount();
  }

  async logout(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Logout',
      message: 'Yakin ingin keluar?',
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Logout',
          handler: async () => {
            await this.auth.logout();
            this.router.navigateByUrl('/login', { replaceUrl: true });
          },
        },
      ],
    });
    await alert.present();
  }
}
