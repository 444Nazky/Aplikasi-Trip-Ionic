import { Injectable } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { APP_CONSTANTS } from '../constants/app.constants';
import { isInsideRegion, RegionModel } from '../../data/models/region.model';

export interface GpsResult {
  lat: number;
  lng: number;
  accuracy: number;
  isAccurate: boolean;
}

/** GPS coordinates + geofencing validation against a region's bounds. */
@Injectable({ providedIn: 'root' })
export class LocationService {
  async getCurrentPosition(): Promise<GpsResult> {
    const position: Position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    });
    const accuracy = position.coords.accuracy;
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy,
      isAccurate: accuracy <= APP_CONSTANTS.gpsAccuracyThresholdMeters,
    };
  }

  /** Geofencing: validate whether a coordinate is inside the given region bounds. */
  isWithinRegion(lat: number, lng: number, region: RegionModel): boolean {
    return isInsideRegion(lat, lng, region);
  }
}


