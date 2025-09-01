import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { RouterLinkWithHref, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule,MatIconModule,RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  
  
})
export class NavbarComponent implements OnInit {
  isLoggedIn=false;
  user:any=null;
  constructor(public login: LoginService)
  {

  }
  ngOnInit(): void {
    this.isLoggedIn=this.login.isLoggedIn();
    this.user=this.login.getUser();
    this.login.loginStatusSubject.asObservable().subscribe(data=>{
      this.isLoggedIn=this.login.isLoggedIn();
      this.user=this.login.getUser();
    });
      
  }
  public logout()
  {
    this.login.logout();
    
    window.location.reload();
   //this.login.loginStatusSubject.next(false);
  }

}
