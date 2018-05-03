import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';

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

  // inject the auth service
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  // log out to the console if there's an error
  register() {
    this.authService.register(this.model).subscribe(() => {
      console.log('registration successfull');
    }, error => {
        console.log(error);
    });
  }

  cancel() {
    // pass the value false, could be anyting, to the parent
    // register mode = false
    this.cancelRegister.emit(false);

    console.log('cancelled');
  }
}
