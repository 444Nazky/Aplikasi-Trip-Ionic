import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NetworkService {
  private online$ = new BehaviorSubject<boolean>(true);

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    const status = await Network.getStatus();
    this.online$.next(status.connected);
    Network.addListener('networkStatusChange', (status) => {
      this.online$.next(status.connected);
    });
  }

  async isOnline(): Promise<boolean> {
    const status = await Network.getStatus();
    return status.connected;
  }

  get onlineStatus$() {
    return this.online$.asObservable();
  }
}
