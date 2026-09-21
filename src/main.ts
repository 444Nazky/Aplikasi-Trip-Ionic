import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, PreloadAllModules, withPreloading } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideIonicAngular, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage-angular';
import { importProvidersFrom } from '@angular/core';

import { AppComponent } from './app/app.component';
import { routes } from './app/app-routing.module';
import { APP_CONSTANTS } from './app/core/constants/app.constants';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(
      IonicStorageModule.forRoot({ name: APP_CONSTANTS.storageDbName, storeName: 'trips' })
    ),
  ],
}).catch((err) => console.error(err));
