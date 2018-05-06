import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any =  {};

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.model).subscribe(data => {
        console.log('logged in successfully');
        console.log(this.model);
      }, error => {
<<<<<<< HEAD
        // get the direct response from the Observable when it encounter's an error condition
=======
>>>>>>> e2551738ac96db5fcaa57cce857fad9d27900676
        console.log(error);
      });
  }

  logout() {
    this.authService.userToken = null;
    localStorage.removeItem('token');
    console.log('logged out');
  }

  loggedIn() {
    const token = localStorage.getItem('token');

    return !!token;
  }
}
