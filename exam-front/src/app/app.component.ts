import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true, // ✅ REQUIRED for standalone components
  imports: [
    RouterOutlet,
    MatButtonModule // ✅ Add any Material modules you're using
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // ❌ typo fixed: should be "styleUrls" (plural)
})
export class AppComponent {
  title = 'exam-front';
}
