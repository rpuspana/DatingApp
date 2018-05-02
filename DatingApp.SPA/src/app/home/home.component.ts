import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  values: any;

  // inject the http service
  constructor(private http: Http) { }

  ngOnInit() {
    this.getValues();
  }

  // get values from the API
  getValues() {
    this.http.get('http://localhost:5000/api/values').subscribe(response => {
      // console.log(response);
      this.values = response.json();
    });
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }
}
