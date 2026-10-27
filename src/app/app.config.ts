import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { headerInterceptor } from './core/interceptors/header-interceptor';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { provideToastr } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch( ),withInterceptors([headerInterceptor,errorInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withViewTransitions(),withInMemoryScrolling({scrollPositionRestoration:'top'})),
    provideToastr(),
    importProvidersFrom(NgxSpinnerModule)
  ]
};
