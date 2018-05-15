// we wabt to tell the app to download just a part of the HTML page, not the whole page
// in order to do this I tell the app about how to find the different parts of the app
// this is what Angular routes provide

import {Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';

// this is a routing configuration
// The Angular Router applys a match-first strategy and returns the component
export const appRoutes: Routes = [
    // home route
    {path: 'home', component: HomeComponent},

    // dummy route - in the scope of protecting multiple routes at once
    {
        path: '',
        runGuardsAndResolvers: 'always',

        // when a use wants to access this rotue or it's child routes, it will call AuthGuard.canActivate()
        // if is satisfy the conditions there, tihs area or a child area will be shown
        canActivate: [AuthGuard],
        children: [
            // child route that inherits all of the properties of the parent route ''
            // members route - full url is http://localhost:8080/('' + members)
            {path: 'members', component: MemberListComponent},

            // child route that inherits all of the properties of the parent route ''
            // messages route - full url is http://localhost:8080/('' + messages)
            {path: 'messages', component: MessagesComponent},

            // child route that inherits all of the properties of the parent route ''
            // lists route - http://localhost:8080/('' + lists)
            {path: 'lists', component: ListsComponent},
        ]
    },

    // this type of route must be placed last in the array
    // because it matches any full URL, ex, localhost:1234/asdf
    {path: '**', redirectTo: 'home', pathMatch: 'full'}
];
