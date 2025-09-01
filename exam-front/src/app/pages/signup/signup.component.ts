import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
//import { JsonPipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import Swal from 'sweetalert2'
import {MatCardModule} from '@angular/material/card';
// import { NgModel } from '@angular/forms';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatCardModule,
    CommonModule,
    MatSnackBarModule,
  ], // Add CommonModule, FormsModule, etc. if needed
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SignupComponent {
  constructor(private userService: UserService, private snack:MatSnackBar) {}
  public user = {
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
  };
  ngOnInit(): void {}

  formSubmit() {
    console.log(this.user);
    if (this.user.username == '' || this.user.username == null) {
      //alert('user is required!!');
      this.snack.open('Username is required!','',{
        duration:1000,
      });
      return;
    }
    //validate

    //addUser: userservice
    this.userService.addUser(this.user).subscribe(
      (data:any) => {
        //success
        console.log(data);
        //alert('success');
        Swal.fire('Successfully done','user is now  registered with id:'+data.id, 'success');
      },
      (error) => {
        //error
        console.log(error);
        //alert('something went wrong');
        this.snack.open('something went wrong!' ,'',{
          duration:1000,
        })
      }
    );
  }
}
