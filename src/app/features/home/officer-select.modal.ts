import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonIcon,
  IonButton,
  ModalController,
} from '@ionic/angular';

interface Officer {
  id: string;
  nama: string;
  region: string;
  status: 'Aktif' | 'Nonaktif';
}

@Component({
  selector: 'app-officer-select-modal',
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, IonButton],
  template: `
    <ion-content class="officer-modal-content">
      <div class="officer-modal-wrap">
        <!-- Close -->
        <div class="modal-close-bar">
          <button type="button" class="close-btn" (click)="dismiss()">
            <ion-icon name="close"></ion-icon>
          </button>
        </div>

        <!-- Header -->
        <div class="officer-header">
          <div class="header-icon-circle">
            <ion-icon name="people"></ion-icon>
          </div>
          <h2 class="header-title">Pilih Petugas</h2>
          <p class="header-sub">Pilih petugas yang akan menggantikan tugas hari ini</p>
        </div>

        <!-- Officer List -->
        <div class="officer-list">
          <div *ngFor="let officer of officers"
               class="officer-row"
               [class.inactive]="officer.status === 'Nonaktif'"
               (click)="selectOfficer(officer)">
            <div class="officer-avatar">
              {{ getInitials(officer.nama) }}
            </div>
            <div class="officer-info">
              <span class="officer-name">{{ officer.nama }}</span>
              <span class="officer-region">{{ officer.region }}</span>
            </div>
            <span class="status-badge"
                  [class.aktif]="officer.status === 'Aktif'"
                  [class.nonaktif]="officer.status === 'Nonaktif'">
              {{ officer.status }}
            </span>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .officer-modal-content { --background: #f8fafc; }
    .officer-modal-wrap {
      padding: 12px 16px calc(24px + env(safe-area-inset-bottom));
      min-height: 100%;
    }
    .modal-close-bar { display: flex; justify-content: flex-end; margin-bottom: 4px; }
    .close-btn {
      width: 36px; height: 36px; border-radius: 50%;
      background: #f1f5f9; border: 1px solid #e2e8f0;
      display: flex; align-items: center; justify-content: center; cursor: pointer;
      ion-icon { font-size: 18px; color: #64748b; }
      &:active { background: #e2e8f0; }
    }
    .officer-header { text-align: center; margin-bottom: 24px; }
    .header-icon-circle {
      width: 52px; height: 52px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      border-radius: 16px; display: flex; align-items: center; justify-content: center;
      margin: 0 auto 12px; box-shadow: 0 6px 16px rgba(37,99,235,0.25);
      ion-icon { font-size: 24px; color: #fff; }
    }
    .header-title { font-size: 19px; font-weight: 800; color: #0f172a; margin: 0 0 4px; }
    .header-sub { font-size: 13px; color: #64748b; margin: 0; }
    .officer-list {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 20px;
      overflow: hidden; box-shadow: 0 2px 8px rgba(15,23,42,0.04);
    }
    .officer-row {
      display: flex; align-items: center; gap: 12px; padding: 14px 16px;
      cursor: pointer; transition: background 0.12s ease;
      border-bottom: 1px solid #f1f5f9;
      &:last-child { border-bottom: none; }
      &:active { background: #f8fafc; }
      &.inactive { opacity: 0.55; }
    }
    .officer-avatar {
      width: 42px; height: 42px; border-radius: 14px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #fff; font-size: 14px; font-weight: 800;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .officer-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .officer-name { font-size: 14px; font-weight: 700; color: #0f172a; }
    .officer-region { font-size: 11px; color: #64748b; }
    .status-badge {
      border-radius: 9999px; padding: 4px 10px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.02em; white-space: nowrap;
      &.aktif { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
      &.nonaktif { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }
    }
  `],
})
export class OfficerSelectModal {
  officers: Officer[] = [
    { id: 'usr-001', nama: 'Budi Santoso', region: 'BADAU', status: 'Aktif' },
    { id: 'usr-002', nama: 'Ahmad Rizki', region: 'BADAU', status: 'Aktif' },
    { id: 'usr-003', nama: 'Dedi Kurniawan', region: 'SINTANG', status: 'Nonaktif' },
    { id: 'usr-004', nama: 'Rina Marlina', region: 'BADAU', status: 'Aktif' },
    { id: 'usr-005', nama: 'Surya Pratama', region: 'KAPUAS HULU', status: 'Nonaktif' },
  ];

  constructor(private modalCtrl: ModalController) {}

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map(w => w.charAt(0).toUpperCase()).join('');
  }

  selectOfficer(officer: Officer): void {
    if (officer.status === 'Nonaktif') return;
    this.modalCtrl.dismiss({ officer }, 'selected');
  }

  dismiss(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
