import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';


@Injectable()
export class AuthService {
    baseUrl = 'http://localhost:5000/api/auth/';
    userToken: any;
    decodedToken: any; // when the page loads this gets set to undefined
    jwtHelper: JwtHelper = new JwtHelper();

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
                console.log(user);

                if (user) {
                    localStorage.setItem('token', user.tokenString);

                    this.decodedToken = this.jwtHelper.decodeToken(user.tokenString);
                    console.log(this.decodedToken);

                    this.userToken = user.tokenString;
                }
            }).catch(this.handleError);
    }

    register(model: any) {
        return this.http.post(this.baseUrl + 'register', model, this.requestOptions())
                .catch(this.handleError);
    }

    //  a JWT exists in local storage,
    //  and if it does, whether it has expired or not.
    loggedIn() {
        // tokenNotExpired(tokenName) can be used to check whether a JWT exists in local storage,
        //  and if it does, whether it has expired or not.
        return tokenNotExpired('token');
    }

    private requestOptions() {
        const headers = new Headers({'Content-type': 'application/json'});

        // headers property is the headers const above
        return new RequestOptions({headers: headers});
    }

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
    }
}
