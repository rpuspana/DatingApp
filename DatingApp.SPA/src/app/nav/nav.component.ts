import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any =  {};

  constructor(private authService: AuthService,
              private alertify: AlertifyService,
              private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.model).subscribe(data => {
        this.alertify.success('logged in successfully');
      }, error => {
        // get the direct response from the Observable when it encounter's an error condition
       this.alertify.error('Failed to log in');
      },
      // what to do when the Observable stream has completed
      () => {
        // use to 'members' route to navigate to the members section of the webpage
        this.router.navigate(['/members']);
      });
  }

  logout() {
    this.authService.userToken = null;

    localStorage.removeItem('token');

    this.alertify.message('logged out');

    // use to 'home' route to navigate to the home section of the webpage
    this.router.navigate(['/home']);
  }

  // check to see if a JWT token exists in localStorage and if it does,
  // see if it expired or not
  loggedIn() {
    return this.authService.loggedIn();
  }
}
