import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

/** Photo capture for selfie/kondisi-kosong evidence photos. */
@Injectable({ providedIn: 'root' })
export class CameraService {
  async capturePhoto(): Promise<string> {
    const photo = await Camera.getPhoto({
      quality: 70,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      allowEditing: false,
    });
    return photo.webPath ?? '';
  }

  async pickFromGallery(): Promise<string> {
    const photo = await Camera.getPhoto({
      quality: 70,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      allowEditing: false,
    });
    return photo.webPath ?? '';
  }
}
