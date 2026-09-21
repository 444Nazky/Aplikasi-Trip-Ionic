import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { TripModel, StatusMuatanTrip } from '../../data/models/trip.model';
import { VehicleModel } from '../../data/models/vehicle.model';
import { generateId } from '../utils/id.util';
import { generateTripNumber } from '../utils/trip-number.util';

/** Holds the currently active trip in-memory while the officer inputs vehicles. */
@Injectable({ providedIn: 'root' })
export class TripService {
  activeTrip: TripModel | null = null;

  constructor(private storage: StorageService, private auth: AuthService) {}

  async startTrip(params: {
    statusMuatan: StatusMuatanTrip;
    keteranganKosong?: string;
    fotoKosongPath?: string;
    startLat: number;
    startLng: number;
  }): Promise<TripModel> {
    const user = this.auth.currentUser!;
    const seq = (await this.storage.countTripsToday()) + 1;
    const trip: TripModel = {
      id: generateId(),
      noTrip: generateTripNumber(seq),
      userId: user.id,
      regionId: user.regionId,
      statusMuatan: params.statusMuatan,
      keteranganKosong: params.keteranganKosong,
      fotoKosongPath: params.fotoKosongPath,
      startLat: params.startLat,
      startLng: params.startLng,
      status: 'active',
      vehicles: [],
      createdAt: new Date().toISOString(),
      isSynced: false,
      syncRetryCount: 0,
      syncFailed: false,
    };
    await this.storage.saveTrip(trip);
    this.activeTrip = trip;
    return trip;
  }

  async addVehicle(vehicle: VehicleModel): Promise<void> {
    if (!this.activeTrip) throw new Error('No active trip');
    this.activeTrip.vehicles.push(vehicle);
    await this.storage.saveTrip(this.activeTrip);
  }

  async completeTrip(endLat: number, endLng: number): Promise<TripModel> {
    if (!this.activeTrip) throw new Error('No active trip');
    if (this.activeTrip.vehicles.length === 0) {
      throw new Error('Minimal 1 kendaraan harus diinput sebelum menyelesaikan trip.');
    }
    this.activeTrip.endLat = endLat;
    this.activeTrip.endLng = endLng;
    this.activeTrip.status = 'completed';
    this.activeTrip.completedAt = new Date().toISOString();
    await this.storage.saveTrip(this.activeTrip);
    const finished = this.activeTrip;
    this.activeTrip = null;
    return finished;
  }
}
