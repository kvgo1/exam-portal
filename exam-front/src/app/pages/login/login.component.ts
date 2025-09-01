import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { JsonPipe, isPlatformBrowser } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormField,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
    JsonPipe,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginData = {
    username: '',
    password: '',
  };

  private isBrowser: boolean;

  constructor(
    private snack: MatSnackBar,
    private login: LoginService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  formSubmit() {
    console.log('Login button clicked');

    // Basic form validation
    if (!this.loginData.username.trim()) {
      this.snack.open('Username is required!', '', { duration: 3000 });
      return;
    }

    if (!this.loginData.password.trim()) {
      this.snack.open('Password is required!', '', { duration: 3000 });
      return;
    }

    // Generate token request
    this.login.generateToken(this.loginData).subscribe(
      (data: any) => {
        console.log('Raw response from backend:', data);

        const token = data?.token;
        if (!token || typeof token !== 'string' || !token.trim()) {
          console.error('Invalid or missing token from backend');
          this.snack.open('Authentication failed. No token received.', '', {
            duration: 3000,
          });
          return;
        }

        console.log('Token received:', token);
        
        // Save token and immediately verify it was stored
        const loginSuccess = this.login.loginUser(token);
        if (!loginSuccess) {
          this.snack.open('Failed to save authentication token.', '', {
            duration: 3000,
          });
          return;
        }

        // Verify token was saved properly
        const savedToken = this.login.getToken();
        console.log('Token retrieved after saving:', savedToken);
        
        if (!savedToken) {
          this.snack.open('Token storage failed. Please try again.', '', {
            duration: 3000,
          });
          return;
        }

        // Add a small delay to ensure token is properly cached
        setTimeout(() => {
          this.fetchCurrentUser();
        }, 100);
      },
      (error) => {
        console.error('Login failed!', error);
        let errorMessage = 'Invalid details! Try again.';
        
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        } else if (error.status === 401) {
          errorMessage = 'Invalid username or password.';
        }
        
        this.snack.open(errorMessage, '', {
          duration: 3000,
        });
      }
    );
  }

  private fetchCurrentUser() {
    console.log('Fetching current user with token:', this.login.getToken());
    
    this.login.getCurrentUser().subscribe(
      (user: any) => {
        console.log('User data received:', user);
        this.login.setUser(user);
        
        const role = this.login.getUserRole();
        console.log('User role:', role);
        
        if (role === 'ADMIN') {
          this.router.navigate(['admin']);
        } else if (role === 'NORMAL') {
          this.router.navigate(['user-dashboard']);
        } else {
          console.error('Unknown user role:', role);
          this.login.logout();
          this.snack.open('Unknown user role. Please contact administrator.', '', {
            duration: 3000,
          });
        }

        this.login.loginStatusSubject.next(true);
      },
      (error) => {
        console.error('Error fetching current user:', error);
        
        let errorMessage = 'Failed to fetch user information.';
        if (error.status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
          this.login.logout();
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        
        this.snack.open(errorMessage, '', { duration: 3000 });
      }
    );
  }
}