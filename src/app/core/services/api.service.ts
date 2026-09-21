import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../constants/app.constants';
import { TripModel } from '../../data/models/trip.model';
import { VehicleModel } from '../../data/models/vehicle.model';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

/** Thin wrapper around the REST API (see api/00-overview.md). */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = API_BASE_URL;

  constructor(private http: HttpClient) {}

  login(pinHash: string, deviceId: string): Promise<ApiResponse<{ token: string; user: any }>> {
    return firstValueFrom(
      this.http.post<ApiResponse<{ token: string; user: any }>>(`${this.base}/auth/login`, {
        pin_hash: pinHash,
        device_id: deviceId,
      })
    );
  }

  refreshToken(token: string): Promise<ApiResponse<{ token: string }>> {
    return firstValueFrom(
      this.http.post<ApiResponse<{ token: string }>>(`${this.base}/auth/refresh`, { token })
    );
  }

  createTrip(trip: TripModel): Promise<ApiResponse<{ id: string }>> {
    return firstValueFrom(
      this.http.post<ApiResponse<{ id: string }>>(`${this.base}/trips`, trip)
    );
  }

  addVehicle(tripId: string, vehicle: VehicleModel): Promise<ApiResponse<{ id: string }>> {
    return firstValueFrom(
      this.http.post<ApiResponse<{ id: string }>>(
        `${this.base}/trips/${tripId}/vehicles`,
        vehicle
      )
    );
  }

  completeTrip(tripId: string, endLat: number, endLng: number): Promise<ApiResponse<void>> {
    return firstValueFrom(
      this.http.put<ApiResponse<void>>(`${this.base}/trips/${tripId}/complete`, {
        end_lat: endLat,
        end_lng: endLng,
      })
    );
  }

  /** Uploads a photo as multipart/form-data, returns the remote URL. */
  async uploadPhoto(localPath: string): Promise<string> {
    const blob = await (await fetch(localPath)).blob();
    const form = new FormData();
    form.append('photo', blob, 'photo.jpg');
    const res = await firstValueFrom(
      this.http.post<ApiResponse<{ url: string }>>(`${this.base}/uploads/photos`, form)
    );
    return res.data?.url ?? '';
  }
}
