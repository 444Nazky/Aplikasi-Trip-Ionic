import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { ApiService } from './api.service';
import { NetworkService } from './network.service';
import { APP_CONSTANTS } from '../constants/app.constants';
import { TripModel } from '../../data/models/trip.model';

/**
 * Offline sync queue processor. Uploads photos then trip JSON, exponential
 * backoff retry (see ionic/offline-sync.md), server-wins for trip header,
 * last-write-wins for vehicles.
 */
@Injectable({ providedIn: 'root' })
export class SyncService {
  private syncing = false;
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private storage: StorageService,
    private api: ApiService,
    private network: NetworkService
  ) {}

  start(): void {
    this.network.onlineStatus$.subscribe(async (online) => {
      if (online) {
        await this.processQueue();
      }
    });
    this.timer = setInterval(() => this.processQueue(), APP_CONSTANTS.syncIntervalMs);
  }

  async processQueue(): Promise<void> {
    if (this.syncing) return;
    if (!(await this.network.isOnline())) return;
    this.syncing = true;
    try {
      const pending = await this.storage.getPendingTrips();
      for (const trip of pending) {
        await this.syncTrip(trip);
      }
    } finally {
      this.syncing = false;
    }
  }

  private async syncTrip(trip: TripModel): Promise<void> {
    try {
      // Upload photos first
      for (const vehicle of trip.vehicles) {
        if (!vehicle.fotoSelfieUrl && vehicle.fotoSelfiePath) {
          vehicle.fotoSelfieUrl = await this.api.uploadPhoto(vehicle.fotoSelfiePath);
        }
      }
      const res = await this.api.createTrip(trip);
      if (!res.success) throw new Error(res.error?.message ?? 'sync failed');
      await this.storage.markTripSynced(trip.id);
    } catch (err) {
      await this.storage.incrementTripRetry(trip.id);
    }
  }

  async pendingCount(): Promise<number> {
    return (await this.storage.getPendingTrips()).length;
  }
}
