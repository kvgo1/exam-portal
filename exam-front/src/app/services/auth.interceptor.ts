// import {
//   HTTP_INTERCEPTORS,
//   HttpEvent,
//   HttpHandler,
//   HttpInterceptor,
//   HttpRequest,
// } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { LoginService } from './login.service';

// const TOKEN_HEADER = 'Authorization';
// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   constructor(private login: LoginService) {}
//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
    

//     //add the jwt token(LocalStorage) request
//     let authReq = req;
//     const token = this.login.getToken();
//     console.log("inside interceptor")
//     if (token != null) {
//       authReq = authReq.clone({
//         setHeaders: { Authorization : `Bearer ${token}` },
//       });
//     }
//     return next.handle(authReq);
//   }
// }

// export const authInterceptorProviders = [
//   {
//     provide: HTTP_INTERCEPTORS,
//     useClass: AuthInterceptor,
//     multi: true,
//   },
// ];
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
} from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { LoginService } from './login.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isBrowser: boolean;

  constructor(
    private login: LoginService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Skip authentication for login/generate-token requests
    if (req.url.includes('/generate-token') || req.url.includes('/login')) {
      return next.handle(req);
    }

    if (!this.isBrowser) {
      return next.handle(req);
    }

    // Use a more reliable way to get the token
    return from(this.getTokenWithRetry()).pipe(
      switchMap(token => {
        let authReq = req;
        
        if (token) {
          console.log('Interceptor adding token to request:', token.substring(0, 20) + '...');
          authReq = req.clone({
            setHeaders: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });
        } else {
          console.warn('No token available for request:', req.url);
        }

        return next.handle(authReq).pipe(
          catchError((error: HttpErrorResponse) => {
            this.handleError(error, req.url);
            return throwError(() => error);
          })
        );
      }),
      catchError(error => {
        console.error('Error in interceptor token retrieval:', error);
        return next.handle(req);
      })
    );
  }

  private async getTokenWithRetry(): Promise<string | null> {
    let retries = 3;
    
    while (retries > 0) {
      const token = this.login.getToken();
      if (token) {
        return token;
      }
      
      // Wait a bit before retrying (for token to be cached)
      await new Promise(resolve => setTimeout(resolve, 50));
      retries--;
    }
    
    return null;
  }

  private handleError(error: HttpErrorResponse, url: string) {
    console.error('HTTP Error for', url, ':', error.status, error.message);
    
    if (error.status === 401 && this.isBrowser) {
      console.warn('Unauthorized! Logging out...');
      this.login.logout();
      
      // Only navigate to login if not already there
      if (!this.router.url.includes('/login')) {
        this.router.navigate(['/login']);
      }
    }
    
    // Handle other error cases
    if (error.status === 0) {
      console.error('Network error - cannot connect to server');
    }
  }
}

export const authInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
];