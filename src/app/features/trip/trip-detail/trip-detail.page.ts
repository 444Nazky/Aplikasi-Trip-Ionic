import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';
import { TripModel } from '../../../data/models/trip.model';

@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
  ],
  templateUrl: './trip-detail.page.html',
})
export class TripDetailPage implements OnInit {
  trip: TripModel | null = null;

  constructor(private route: ActivatedRoute, private storage: StorageService) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.trip = (await this.storage.getTrip(id)) ?? null;
  }
}
