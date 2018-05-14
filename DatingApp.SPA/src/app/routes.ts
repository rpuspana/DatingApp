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

    // members route
    // when a use wants to access this area, it will call AuthGuard.canActivate()
    // if is satisfy the conditions there, the area will be shown
    {path: 'members', component: MemberListComponent, canActivate: [AuthGuard]},

    // messages route
    {path: 'messages', component: MessagesComponent},

    // lists route
    {path: 'lists', component: ListsComponent},

    // this type of route must be placed last in the array
    // because it matches any full URL, ex, localhost:1234/asdf
    {path: '**', redirectTo: 'home', pathMatch: 'full'}
];
