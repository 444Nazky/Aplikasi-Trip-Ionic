import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonList, IonItem, IonLabel, IonNote, IonIcon } from '@ionic/angular';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, IonContent, IonList, IonItem, IonLabel, IonNote, IonIcon],
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  private router = inject(Router);
  private storage = inject(StorageService);

  trips: any[] = [];

  async ngOnInit(): Promise<void> {
    const allTrips = await this.storage.getAllTrips();
    this.trips = allTrips
      .map((t) => ({
        id: t.id,
        noTrip: t.noTrip,
        rute: t.rute || '-',
        vehicleCount: t.vehicles.length,
        time: new Date(t.createdAt).toLocaleString('id-ID'),
        isSynced: t.isSynced,
      }))
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  }

  viewTrip(id: string): void {
    this.router.navigate(['/trip', id]);
  }
}
