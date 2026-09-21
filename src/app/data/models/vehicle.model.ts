import { Golongan, JenisKendaraan } from './tariff.model';

export type StatusMuatanVehicle = 'Dengan Muatan' | 'Tanpa Muatan';

export interface VehicleModel {
  id: string;
  tripId: string;
  kendaraanKe: number;
  noPolisi: string;
  golongan: Golongan;
  jenisKendaraan: JenisKendaraan;
  muatan: StatusMuatanVehicle;
  fotoSelfiePath: string;
  fotoSelfieUrl?: string;
  tarif: number;
  lat: number;
  lng: number;
  gpsAccuracy?: number;
  createdAt: string;
}
