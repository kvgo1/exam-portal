import { Component,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatFormFieldModule,MatInputModule,MatButtonModule], // Add CommonModule, FormsModule, etc. if needed
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SignupComponent {}
