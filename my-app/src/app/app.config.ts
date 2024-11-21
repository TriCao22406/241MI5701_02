import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthInterceptor } from './service/auth.service';
import { importProvidersFrom } from '@angular/core'; 
import { MatSnackBarModule } from '@angular/material/snack-bar'; 
import { MatSidenavModule } from '@angular/material/sidenav';

// Import các module Angular Material
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(), 
    provideAnimationsAsync(),
    provideAnimationsAsync(),     
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    importProvidersFrom(MatSnackBarModule),
    importProvidersFrom(MatTableModule),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(MatSidenavModule),
    provideAnimationsAsync(), 
  ]
};
