export type Golongan = 'Internal' | 'Eksternal';
export type JenisKendaraan = 'Truk' | 'Mobil' | 'Motor';

export interface TariffModel {
  id: string;
  golongan: Golongan;
  jenisKendaraan: JenisKendaraan;
  tarifMuatan: number;
  tarifTanpaMuatan: number;
  regionId?: string;
}
