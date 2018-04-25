import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.css']
})
export class ValueComponent implements OnInit {
  values: any;

  constructor(private http: Http) { }

  // lifecycle hook
  // fired after the constructor has finished
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

}
