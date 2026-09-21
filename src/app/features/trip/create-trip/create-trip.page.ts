import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  ToastController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonSpinner,
  IonIcon,
  IonCard,
  IonBadge,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { LocationService } from '../../../core/services/location.service';
import { CameraService } from '../../../core/services/camera.service';
import { TripService } from '../../../core/services/trip.service';
import { StatusMuatanTrip } from '../../../data/models/trip.model';

@Component({
  selector: 'app-create-trip',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonInput,
    IonButton,
    IonSpinner,
    IonIcon,
    IonCard,
    IonBadge,
  ],
  templateUrl: './create-trip.page.html',
  styleUrls: ['./create-trip.page.scss'],
})
export class CreateTripPage {
  statusMuatan: StatusMuatanTrip = 'Ada Muatan';
  keterangan = '';
  fotoKosongPath = '';
  saving = false;

  constructor(
    private location: LocationService,
    private camera: CameraService,
    private tripService: TripService,
    private alertCtrl: AlertController,
    private toast: ToastController,
    private router: Router
  ) {}

  async capturePhoto(): Promise<void> {
    try {
      this.fotoKosongPath = await this.camera.capturePhoto();
    } catch {
      await this.showToast('Gagal mengambil foto. Silakan coba lagi.');
    }
  }

  get canSubmit(): boolean {
    if (this.statusMuatan === 'Kosong') {
      return !!this.keterangan && !!this.fotoKosongPath;
    }
    return true;
  }

  async submit(): Promise<void> {
    if (!this.canSubmit) {
      await this.showToast('Keterangan dan foto kondisi wajib diisi untuk status Kosong.');
      return;
    }
    this.saving = true;
    try {
      const gps = await this.location.getCurrentPosition();
      if (!gps.isAccurate) {
        await this.showToast('Akurasi GPS rendah, data akan ditandai sebagai anomali.');
      }
      await this.tripService.startTrip({
        statusMuatan: this.statusMuatan,
        keteranganKosong: this.statusMuatan === 'Kosong' ? this.keterangan : undefined,
        fotoKosongPath: this.statusMuatan === 'Kosong' ? this.fotoKosongPath : undefined,
        startLat: gps.lat,
        startLng: gps.lng,
      });
      this.router.navigateByUrl('/input-vehicle', { replaceUrl: true });
    } catch (e) {
      await this.showToast('Layanan lokasi tidak aktif. Mohon aktifkan GPS.');
    } finally {
      this.saving = false;
    }
  }

  private async showToast(message: string): Promise<void> {
    const t = await this.toast.create({ message, duration: 2500 });
    await t.present();
  }
}
