import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';
import { TripModel } from '../../../data/models/trip.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
  ],
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  trips: (TripModel & { total: number })[] = [];

  constructor(private storage: StorageService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.load();
  }

  private async load(): Promise<void> {
    const trips = await this.storage.getAllTrips();
    this.trips = trips
      .sort((a: TripModel, b: TripModel) => b.createdAt.localeCompare(a.createdAt))
      .map((t: TripModel) => ({
        ...t,
        total: t.vehicles.reduce((s: number, v) => s + v.tarif, 0),
      }));
  }

  viewDetail(trip: TripModel): void {
    this.router.navigate(['/trip-detail', trip.id]);
  }
}
