import { Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'signup',
    pathMatch: 'full' // ✅ This redirects root to /signup
  },
  {
    path: 'signup',
    component: SignupComponent,
    pathMatch: 'full'
  }
];
