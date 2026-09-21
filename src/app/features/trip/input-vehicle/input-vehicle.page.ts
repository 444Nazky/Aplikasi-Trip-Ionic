import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ToastController,
  AlertController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonSpinner,
  IonButtons,
  IonBackButton,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { LocationService } from '../../../core/services/location.service';
import { CameraService } from '../../../core/services/camera.service';
import { TariffService } from '../../../core/services/tariff.service';
import { TripService } from '../../../core/services/trip.service';
import { generateId } from '../../../core/utils/id.util';
import { Golongan, JenisKendaraan } from '../../../data/models/tariff.model';
import { StatusMuatanVehicle, VehicleModel } from '../../../data/models/vehicle.model';

@Component({
  selector: 'app-input-vehicle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonSpinner,
    IonButtons,
    IonBackButton,
  ],
  templateUrl: './input-vehicle.page.html',
  styleUrls: ['./input-vehicle.page.scss'],
})
export class InputVehiclePage implements OnInit {
  noTrip = '';
  vehicleCount = 1;
  noPolisi = '';
  golongan: Golongan = 'Eksternal';
  jenis: JenisKendaraan = 'Truk';
  muatan: StatusMuatanVehicle = 'Dengan Muatan';
  fotoPath = '';
  gpsText = '';
  saving = false;

  vehicleTypes = [
    { value: 'Truk' as JenisKendaraan, label: 'Truk', icon: 'car-sport-outline' },
    { value: 'Mobil' as JenisKendaraan, label: 'Mobil', icon: 'car-outline' },
    { value: 'Motor' as JenisKendaraan, label: 'Motor', icon: 'bicycle-outline' },
  ];

  private lastGps?: { lat: number; lng: number; accuracy: number };

  constructor(
    private location: LocationService,
    private camera: CameraService,
    private tariffService: TariffService,
    private tripService: TripService,
    private toast: ToastController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit(): void {
    const trip = this.tripService.activeTrip;
    if (!trip) {
      this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
      return;
    }
    this.noTrip = trip.noTrip;
    this.vehicleCount = trip.vehicles.length + 1;
  }

  get isValid(): boolean {
    return !!this.noPolisi && !!this.fotoPath && !!this.lastGps;
  }

  async capturePhoto(): Promise<void> {
    try {
      this.fotoPath = await this.camera.capturePhoto();
      const gps = await this.location.getCurrentPosition();
      this.lastGps = gps;
      this.gpsText = `${gps.lat.toFixed(5)}, ${gps.lng.toFixed(5)}`;
      if (!gps.isAccurate) {
        await this.showToast('Akurasi GPS rendah (>50m), data akan ditandai anomali.');
      }
    } catch {
      await this.showToast('Gagal mengambil foto atau lokasi. Silakan coba lagi.');
    }
  }

  async submit(): Promise<void> {
    if (!this.isValid || !this.lastGps) return;
    this.saving = true;
    try {
      const tarif = await this.tariffService.calculate(this.golongan, this.jenis, this.muatan);
      const vehicle: VehicleModel = {
        id: generateId(),
        tripId: this.tripService.activeTrip!.id,
        kendaraanKe: this.vehicleCount,
        noPolisi: this.noPolisi,
        golongan: this.golongan,
        jenisKendaraan: this.jenis,
        muatan: this.muatan,
        fotoSelfiePath: this.fotoPath,
        tarif,
        lat: this.lastGps.lat,
        lng: this.lastGps.lng,
        gpsAccuracy: this.lastGps.accuracy,
        createdAt: new Date().toISOString(),
      };
      await this.tripService.addVehicle(vehicle);
      await this.promptNextOrFinish();
    } finally {
      this.saving = false;
    }
  }

  private async promptNextOrFinish(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Data Tersimpan',
      message: `Kendaraan ke-${this.vehicleCount} berhasil disimpan.`,
      buttons: [
        {
          text: 'Selesai Trip',
          handler: () => this.finishTrip(),
        },
        {
          text: 'Tambah Kendaraan',
          handler: () => this.resetForm(),
        },
      ],
    });
    await alert.present();
  }

  private resetForm(): void {
    this.vehicleCount += 1;
    this.noPolisi = '';
    this.fotoPath = '';
    this.gpsText = '';
    this.lastGps = undefined;
  }

  private async finishTrip(): Promise<void> {
    try {
      const gps = await this.location.getCurrentPosition();
      const trip = await this.tripService.completeTrip(gps.lat, gps.lng);
      this.router.navigate(['/success', trip.id], { replaceUrl: true });
    } catch (e: any) {
      await this.showToast(e?.message ?? 'Gagal menyelesaikan trip.');
    }
  }

  private async showToast(message: string): Promise<void> {
    const t = await this.toast.create({ message, duration: 2500 });
    await t.present();
  }
}
