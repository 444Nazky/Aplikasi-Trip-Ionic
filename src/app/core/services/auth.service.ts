import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { StorageService } from './storage.service';
import { ApiService } from './api.service';
import { NetworkService } from './network.service';
import { hashPin } from '../utils/hash.util';
import { UserModel } from '../../data/models/user.model';

const DEVICE_ID_KEY = 'device_id';

/** PIN login + device binding + Firebase token session (see firebase/auth.md). */
@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser: UserModel | null = null;

  constructor(
    private storage: StorageService,
    private api: ApiService,
    private network: NetworkService
  ) {}

  async getDeviceId(): Promise<string> {
    const existing = await Preferences.get({ key: DEVICE_ID_KEY });
    if (existing.value) return existing.value;
    const id = crypto.randomUUID();
    await Preferences.set({ key: DEVICE_ID_KEY, value: id });
    return id;
  }

  async login(pin: string): Promise<{ success: boolean; message?: string }> {
    const pinHash = await hashPin(pin);
    const deviceId = await this.getDeviceId();

    // Offline fallback: allow previously logged-in users to resume their session.
    if (!this.network.isOnline()) {
      const restored = await this.restoreSession();
      if (restored && this.currentUser) {
        return { success: true };
      }
      return { success: false, message: 'Tidak ada koneksi internet. Silakan coba lagi.' };
    }

    try {
      const res = await this.api.login(pinHash, deviceId);
      if (!res.success || !res.data) {
        return { success: false, message: res.error?.message ?? 'PIN atau perangkat tidak valid' };
      }
      const user: UserModel = {
        ...res.data.user,
        deviceId,
        token: res.data.token,
        tokenExpiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };
      this.currentUser = user;
      await this.storage.setCurrentUser(user);
      return { success: true };
    } catch (e) {
      return { success: false, message: 'Tidak ada koneksi internet. Silakan coba lagi.' };
    }
  }

  async restoreSession(): Promise<boolean> {
    const user = await this.storage.getCurrentUser();
    if (!user) return false;
    if (user.tokenExpiresAt && user.tokenExpiresAt < Date.now()) {
      await this.logout();
      return false;
    }
    this.currentUser = user;
    return true;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    await this.storage.clearCurrentUser();
  }
}