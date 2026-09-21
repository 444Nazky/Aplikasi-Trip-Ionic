import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { NetworkService } from '../../core/services/network.service';
import { StorageService } from '../../core/services/storage.service';
import { SyncService } from '../../core/services/sync.service';

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
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
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

  constructor(
    private auth: AuthService,
    private network: NetworkService,
    private storage: StorageService,
    private sync: SyncService
  ) {}

  async ngOnInit(): Promise<void> {
    const user = this.auth.currentUser;
    this.userName = user?.nama ?? '';
    this.regionName = user?.regionName ?? '';
    this.network.onlineStatus$.subscribe((online) => (this.isOnline = online));
    await this.refreshSummary();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.refreshSummary();
  }

  private async refreshSummary(): Promise<void> {
    const trips = await this.storage.getAllTrips();
    const today = new Date().toDateString();
    const todayTrips = trips.filter((t) => new Date(t.createdAt).toDateString() === today);
    this.tripCount = todayTrips.length;
    this.vehicleCount = todayTrips.reduce((sum, t) => sum + t.vehicles.length, 0);
  }

  async manualSync(): Promise<void> {
    await this.sync.processQueue();
    await this.refreshSummary();
  }
}
