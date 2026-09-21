import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  pin = '';
  loading = false;
  error = signal<string | null>(null);

  constructor(
    private router: Router,
    private storage: StorageService,
    private api: ApiService
  ) {}

  onPinChange(value: string) {
    this.pin = value;
    this.error.set(null);
  }

  async login() {
    if (this.pin.length !== 6) return;
    this.loading = true;
    this.error.set(null);

    const user = await this.storage.getCurrentUser();
    if (!user) {
      this.error.set('User tidak ditemukan. Hubungi admin.');
      this.loading = false;
      return;
    }

    // TODO: call api.login(pinHash, deviceId) when backend ready
    this.storage.setCurrentUser({ ...user, pin: this.pin });
    this.router.navigate(['/home']);
    this.loading = false;
  }
}

function signal<T>(initial: T) {
  // placeholder — replace with actual signal from @angular/core when available
  let value = initial;
  const subscribers = new Set<(v: T) => void>();
  return {
    get value() { return value; },
    set(v: T) { value = v; subscribers.forEach(fn => fn(v)); },
    subscribe(fn: (v: T) => void) { subscribers.add(fn); },
  };
}
