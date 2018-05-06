import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
<<<<<<< HEAD
import {Observable} from 'rxjs/Observable';
=======
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
>>>>>>> e2551738ac96db5fcaa57cce857fad9d27900676


@Injectable()
export class AuthService {
    baseUrl = 'http://localhost:5000/api/auth/';
    userToken: any;

    // inject the http service from Angular
    constructor(private http: Http) { }

    // calls the login method in the API
    login(model: any) {

        // issue a request
        // model = body of request = username and password from the user
        // because I am sending a post I need to tell the API what
        // type of content (angular/json in my case) I am sending out.
        // map()
        //  - RXJS function
        //  - is used for transforming the servers's response into something else
        return this.http.post(this.baseUrl + 'login', model, this.requestOptions()).map(
            (response: Response) => {
                const user = response.json();
                if (user) {
                    localStorage.setItem('token', user.tokenString);
                    this.userToken = user.tokenString;
                }
            }).catch(this.handleError);
    }

    register(model: any) {
<<<<<<< HEAD
        return this.http.post(this.baseUrl + 'register', model, this.requestOptinos())
                .catch(this.handleError);
=======
        return this.http.post(this.baseUrl + 'register', model, this.requestOptions());
>>>>>>> e2551738ac96db5fcaa57cce857fad9d27900676
    }

    private requestOptions() {
        const headers = new Headers({'Content-type': 'application/json'});

        // headers property is the headers const above
        return new RequestOptions({headers: headers});
    }

<<<<<<< HEAD
    // handle server errors(status code 500) and client errors(status code 400)
    private handleError(error: any) {
        // message returned by the server
        const applicationError = error.headers.get('Application-Error');

        // server error
        if (applicationError) {
            return Observable.throw(applicationError);
        }

        // target the ModelState errors
        // extract the errors from the body of the request
        const serverError = error.json();

        let modelStateErrors = '';

        if (serverError) {
            // loop through the keys in the response's body
            for (const key in serverError) {
                if (serverError[key]) {
                    modelStateErrors += serverError[key] + '\n';
                }
            }
        }

        return Observable.throw(
            // if there are errors in the body, return them, or return 'Server error'
            modelStateErrors || 'Server error.'
        );
=======
    // error handling
    private handleError(error: any) {

        // get the error from the responses's header
        const applicatinError = error.Headers.get('Application-Error');

        if (applicatinError) {
            return Observable.throw(applicatinError);
        }

        // handle model state errors
        // loop through the error messages in the response's body
        // const serverError
>>>>>>> e2551738ac96db5fcaa57cce857fad9d27900676
    }
}
