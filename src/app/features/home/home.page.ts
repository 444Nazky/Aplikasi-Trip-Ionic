import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonButton,
  IonCard,
  IonCardContent,
  IonChip,
  IonBadge,
  ModalController,
} from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { NetworkService } from '../../core/services/network.service';
import { StorageService } from '../../core/services/storage.service';
import { SyncService } from '../../core/services/sync.service';
import { TripModel } from '../../data/models/trip.model';
import { PinVerifyModal } from './pin-verify.modal';
import { OfficerSelectModal } from './officer-select.modal';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonButton,
    IonCard,
    IonCardContent,
    IonChip,
    IonBadge,
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userName = '';
  regionName = '';
  isOnline = true;
  tripCount = 0;
  vehicleCount = 0;
  recentTrips: TripModel[] = [];

  constructor(
    private auth: AuthService,
    private network: NetworkService,
    private storage: StorageService,
    private sync: SyncService,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit(): Promise<void> {
    const user = this.auth.currentUser;
    this.userName = user?.nama ?? '';
    this.regionName = user?.regionName ?? '';
    this.network.onlineStatus$.subscribe((online) => (this.isOnline = online));
    await this.refreshData();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.refreshData();
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name
      .split(' ')
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase())
      .join('');
  }

  private async refreshData(): Promise<void> {
    const trips = await this.storage.getAllTrips();
    const today = new Date().toDateString();
    const todayTrips = trips.filter(
      (t) => new Date(t.createdAt).toDateString() === today
    );
    this.tripCount = todayTrips.length;
    this.vehicleCount = todayTrips.reduce(
      (sum, t) => sum + t.vehicles.length,
      0
    );
    this.recentTrips = todayTrips
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 3);
  }

  async manualSync(): Promise<void> {
    if (!this.isOnline) return;
    await this.sync.processQueue();
    await this.refreshData();
  }

  // ── Ganti Petugas Flow ──
  async openGantiPetugas(): Promise<void> {
    const pinModal = await this.modalCtrl.create({
      component: PinVerifyModal,
      cssClass: 'pin-verify-modal',
      showBackdrop: true,
      backdropDismiss: true,
    });
    await pinModal.present();

    const { data, role } = await pinModal.onWillDismiss();
    if (role === 'verified' && data?.verified) {
      const officerModal = await this.modalCtrl.create({
        component: OfficerSelectModal,
        cssClass: 'officer-select-modal',
        showBackdrop: true,
        backdropDismiss: true,
      });
      await officerModal.present();

      const officerResult = await officerModal.onWillDismiss();
      if (officerResult.role === 'selected' && officerResult.data?.officer) {
        // Petugas selected — refresh user data from auth
        const selected = officerResult.data.officer;
        this.userName = selected.nama;
        this.regionName = selected.region;
      }
    }
  }
}
