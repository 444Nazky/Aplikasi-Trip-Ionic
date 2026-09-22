import { Component, OnInit, inject } from '@angular/core';
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
  ],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  private auth = inject(AuthService);
  private storage = inject(StorageService);
  private sync = inject(SyncService);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);

  userName = '';
  regionName = '';
  totalTrips = 0;
  pendingSync = 0;

  async ngOnInit(): Promise<void> {
    const user = this.auth.currentUser;
    this.userName = user?.nama ?? '';
    this.regionName = user?.regionName ?? '';
    this.totalTrips = (await this.storage.getAllTrips()).length;
    this.pendingSync = await this.sync.pendingCount();
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join('');
  }

  async logout(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Logout',
      message: 'Yakin ingin keluar?',
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Logout',
          role: 'destructive',
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
