import { Injectable } from '@angular/core';

// make alertify available in this service as a global variable
// alertify is already declared inside alertify.js file

// declare is used to tell TypeScript that the variable has been created elsewhere
// nothing is added to the JavaScript that is generated - it is simply a hint to the compiler.
declare let alertify: any;

@Injectable()
export class AlertifyService {

    constructor() { }

    // add methods that we will use from the alertify library
    // () => any = annonymous function called after the confirmed dialog has been confirmed
    confirm(message: string, okCallback: () => any) {
        alertify.confirm(message, function(e) {
            if (e) {
                // call function when the user confirms
                okCallback();
            } else {
                // do something else when the user cancels the confirm dialog
            }
        });
    }

    success(message: string) {
        alertify.success(message);
    }

    error(message: string) {
        alertify.error(message);
    }

    warning(message: string) {
        alertify.warning(message);
    }

    message(message: string) {
        alertify.message(message);
    }

}
