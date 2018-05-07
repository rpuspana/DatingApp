import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {}; // store the inputs from the form

  // output property
  // outuput decorator emits events
  @Output() cancelRegister = new EventEmitter();

  // inject the auth service, alertify service
  constructor(private authService: AuthService,
              private alertify: AlertifyService) { }

  ngOnInit() {
  }

  register() {
    this.authService.register(this.model).subscribe( () => {

      this.alertify.success('registration successfull');
    }, error => {
        // return the error from the Observable
        // if there's an error in the response
        this.alertify.error(error);
    });
  }

  cancel() {
    // pass the value false, could be anyting, to the parent
    // register mode = false
    this.cancelRegister.emit(false);
  }
}
