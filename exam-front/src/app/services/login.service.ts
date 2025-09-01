import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import baseUrl from "./helper";
import { Subject } from "rxjs";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  public loginStatusSubject = new Subject<boolean>();
  private isBrowser: boolean;
  private tokenCache: string | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.initializeToken();
  }

  // Initialize token safely
  private initializeToken() {
    if (this.isBrowser) {
      try {
        this.tokenCache = localStorage.getItem("token");
        console.log("Initialized token from localStorage:", this.tokenCache);
      } catch (error) {
        console.error("Error accessing localStorage:", error);
        this.tokenCache = null;
      }
    }
  }

  // Get current user
  public getCurrentUser() {
    const token = this.getToken();
    console.log("Token for current-user request:", token);
    
    if (!token) {
      console.error("No token available for current-user request");
      throw new Error('No authentication token available');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${baseUrl}/current-user`, { headers });
  }

  // Generate token
  public generateToken(loginData: any) {
    return this.http.post(`${baseUrl}/generate-token`, loginData);
  }

  // Login user: set token in LocalStorage + memory cache
  public loginUser(token: string): boolean {
    if (!token || typeof token !== 'string') {
      console.error("Invalid token received:", token);
      return false;
    }

    this.tokenCache = token;
    console.log("Token cached in service:", token);

    if (this.isBrowser) {
      try {
        localStorage.setItem("token", token);
        console.log("Token saved to localStorage:", token);
      } catch (error) {
        console.error("Error saving token to localStorage:", error);
        return false;
      }
    }
    
    this.loginStatusSubject.next(true);
    return true;
  }

  // Check if user is logged in
  public isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }

  // Logout: remove token and user from local storage + cache
  public logout(): boolean {
    this.tokenCache = null;
    
    if (this.isBrowser) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
    }
    
    this.loginStatusSubject.next(false);
    return true;
  }

  // Get token (from memory cache first, then localStorage)
  public getToken(): string | null {
    if (this.tokenCache) {
      return this.tokenCache;
    }
    
    if (this.isBrowser) {
      try {
        const token = localStorage.getItem('token');
        this.tokenCache = token;
        return token;
      } catch (error) {
        console.error("Error accessing localStorage:", error);
        return null;
      }
    }
    
    return null;
  }

  // Get user safely without circular dependency
  public getUser(): any {
    if (!this.isBrowser) return null;
    
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        return JSON.parse(userStr);
      }
    } catch (error) {
      console.error("Error getting user from localStorage:", error);
      return null;
    }
    
    return null;
  }

  // Set user details
  public setUser(user: any): void {
    if (this.isBrowser) {
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error("Error saving user to localStorage:", error);
      }
    }
  }

  // Get user role
  public getUserRole(): string | null {
    const user = this.getUser();
    if (user && user.authorities && user.authorities.length > 0) {
      return user.authorities[0].authority;
    }
    return null;
  }
}