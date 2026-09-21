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
    if (!match) return 0;
    return muatan === 'Dengan Muatan' ? match.tarifMuatan : match.tarifTanpaMuatan;
  }
}
