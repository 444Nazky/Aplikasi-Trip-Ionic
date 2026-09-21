import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Golongan, JenisKendaraan, TariffModel } from '../../data/models/tariff.model';
import { StatusMuatanVehicle } from '../../data/models/vehicle.model';

/** Calculates tariff automatically from golongan + jenis kendaraan + status muatan. */
@Injectable({ providedIn: 'root' })
export class TariffService {
  constructor(private storage: StorageService) {}

  async calculate(
    golongan: Golongan,
    jenisKendaraan: JenisKendaraan,
    muatan: StatusMuatanVehicle
  ): Promise<number> {
    const tariffs = await this.storage.getTariffs();
    const match: TariffModel | undefined = tariffs.find(
      (t) => t.golongan === golongan && t.jenisKendaraan === jenisKendaraan
    );
    if (match) {
      return muatan === 'Dengan Muatan' ? match.tarifMuatan : match.tarifTanpaMuatan;
    }
    // Default fallback tariffs when offline and master tariffs not yet synced from server
    const defaults: Record<string, { muatan: number; tanpa: number }> = {
      'Eksternal-Truk': { muatan: 120000, tanpa: 60000 },
      'Eksternal-Mobil': { muatan: 80000, tanpa: 40000 },
      'Eksternal-Motor': { muatan: 25000, tanpa: 15000 },
      'Internal-Truk': { muatan: 0, tanpa: 0 },
      'Internal-Mobil': { muatan: 0, tanpa: 0 },
      'Internal-Motor': { muatan: 0, tanpa: 0 },
    };
    const key = `${golongan}-${jenisKendaraan}`;
    const def = defaults[key];
    if (!def) return 0;
    return muatan === 'Dengan Muatan' ? def.muatan : def.tanpa;
  }
}
