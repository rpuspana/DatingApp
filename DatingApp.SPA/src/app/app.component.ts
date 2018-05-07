import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'dating app';

  // jwtHelper, of type JwtHelper, takes reference of new JwtHelper();
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private authServcie: AuthService) {}

  ngOnInit() {
    const token = localStorage.getItem('token');

    // token is populated
    if (token) {
      this.authServcie.decodedToken = this.jwtHelper.decodeToken(token);
    }
  }
}
