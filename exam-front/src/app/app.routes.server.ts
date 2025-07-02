import { RenderMode, ServerRoute } from '@angular/ssr';
import { SignupComponent } from './pages/signup/signup.component';
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
 
];
