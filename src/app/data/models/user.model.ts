export interface UserModel {
  id: string;
  nama: string;
  regionId: string;
  regionName?: string;
  deviceId: string;
  token?: string;
  tokenExpiresAt?: number;
}
