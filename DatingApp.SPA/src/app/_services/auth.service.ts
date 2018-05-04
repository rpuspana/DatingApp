import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';


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
            });
    }

    register(model: any) {
        return this.http.post(this.baseUrl + 'register', model, this.requestOptions());
    }

    private requestOptions() {
        const headers = new Headers({'Content-type': 'application/json'});

        // headers property is the headers const above
        return new RequestOptions({headers: headers});
    }

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
    }
}
