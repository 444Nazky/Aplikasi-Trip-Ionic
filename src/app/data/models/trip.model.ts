import { VehicleModel } from './vehicle.model';

export type StatusMuatanTrip = 'Ada Muatan' | 'Kosong';
export type TripStatus = 'active' | 'completed';

export interface TripModel {
  id: string;
  noTrip: string;
  userId: string;
  regionId: string;
  rute?: string;
  statusMuatan: StatusMuatanTrip;
  keteranganKosong?: string;
  fotoKosongPath?: string;
  startLat: number;
  startLng: number;
  endLat?: number;
  endLng?: number;
  status: TripStatus;
  vehicles: VehicleModel[];
  createdAt: string;
  completedAt?: string;
  isSynced: boolean;
  syncRetryCount: number;
  syncFailed: boolean;
}
