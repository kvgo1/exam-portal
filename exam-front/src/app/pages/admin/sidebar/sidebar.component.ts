import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { MatActionList, MatListModule } from '@angular/material/list';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router'; 


@Component({
  selector: 'app-sidebar',
  imports: [MatCardModule,
    MatListModule,
    MatIconModule,
   RouterModule ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

}
