export interface RegionModel {
  id: string;
  nama: string;
  kode: string;
  batasLatMin: number;
  batasLatMax: number;
  batasLngMin: number;
  batasLngMax: number;
}

/** Returns true when the given coordinate falls within the region bounds. */
export function isInsideRegion(lat: number, lng: number, region: RegionModel): boolean {
  return (
    lat >= region.batasLatMin &&
    lat <= region.batasLatMax &&
    lng >= region.batasLngMin &&
    lng <= region.batasLngMax
  );
}
