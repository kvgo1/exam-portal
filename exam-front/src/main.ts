import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { AuthInterceptor } from './app/services/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';


bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideHttpClient(
      withInterceptorsFromDi(),  // ✅ This allows Angular to resolve class-based interceptors
      withFetch()
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    ...(appConfig.providers || [])
  ]
}).catch((err) => console.error(err));
