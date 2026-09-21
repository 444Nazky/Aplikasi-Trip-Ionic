import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';
import { TripModel } from '../../../data/models/trip.model';

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton],
  templateUrl: './success-dialog.page.html',
  styleUrls: ['./success-dialog.page.scss'],
})
export class SuccessDialogPage implements OnInit {
  trip: TripModel | null = null;
  total = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.trip = (await this.storage.getTrip(id)) ?? null;
    this.total = this.trip?.vehicles.reduce((s, v) => s + v.tarif, 0) ?? 0;
  }

  done(): void {
    this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
  }
}
