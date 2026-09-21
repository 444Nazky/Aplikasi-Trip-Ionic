import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { TripModel } from '../../data/models/trip.model';
import { UserModel } from '../../data/models/user.model';
import { TariffModel } from '../../data/models/tariff.model';
import { APP_CONSTANTS } from '../constants/app.constants';

const KEY_TRIPS = 'trips';
const KEY_USER = 'current_user';
const KEY_TARIFFS = 'tariffs';

/**
 * Wraps @ionic/storage-angular (IndexedDB/SQLite backed) as the single local
 * persistence layer. Offline-first: every trip/vehicle write goes here first.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private storage: Storage | null = null;
  private ready: Promise<void>;

  constructor(private ionicStorage: Storage) {
    this.ready = this.init();
  }

  private async init(): Promise<void> {
    this.storage = await this.ionicStorage.create();
  }

  private async db(): Promise<Storage> {
    await this.ready;
    return this.storage!;
  }

  // ---- User / session ----
  async setCurrentUser(user: UserModel): Promise<void> {
    (await this.db()).set(KEY_USER, user);
  }

  async getCurrentUser(): Promise<UserModel | null> {
    return ((await this.db()).get(KEY_USER) ?? null);
  }

  async clearCurrentUser(): Promise<void> {
    (await this.db()).remove(KEY_USER);
  }

  // ---- Trips ----
  async getAllTrips(): Promise<TripModel[]> {
    return ((await this.db()).get(KEY_TRIPS) ?? []);
  }

  async saveTrip(trip: TripModel): Promise<void> {
    const trips = await this.getAllTrips();
    const idx = trips.findIndex((t) => t.id === trip.id);
    if (idx >= 0) {
      trips[idx] = trip;
    } else {
      trips.push(trip);
    }
    (await this.db()).set(KEY_TRIPS, trips);
  }

  async getTrip(id: string): Promise<TripModel | undefined> {
    return (await this.getAllTrips()).find((t) => t.id === id);
  }

  async getPendingTrips(): Promise<TripModel[]> {
    return (await this.getAllTrips()).filter((t) => !t.isSynced && !t.syncFailed);
  }

  async markTripSynced(id: string): Promise<void> {
    const trip = await this.getTrip(id);
    if (!trip) return;
    trip.isSynced = true;
    await this.saveTrip(trip);
  }

  async incrementTripRetry(id: string): Promise<void> {
    const trip = await this.getTrip(id);
    if (!trip) return;
    trip.syncRetryCount += 1;
    if (trip.syncRetryCount >= APP_CONSTANTS.maxSyncRetries) {
      trip.syncFailed = true;
    }
    await this.saveTrip(trip);
  }

  async countTripsToday(): Promise<number> {
    const today = new Date().toDateString();
    return (await this.getAllTrips()).filter(
      (t) => new Date(t.createdAt).toDateString() === today
    ).length;
  }

  // ---- Tariffs (master data cache, server wins) ----
  async setTariffs(tariffs: TariffModel[]): Promise<void> {
    (await this.db()).set(KEY_TARIFFS, tariffs);
  }

  async getTariffs(): Promise<TariffModel[]> {
    return ((await this.db()).get(KEY_TARIFFS) ?? []);
  }
}
