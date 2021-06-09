import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RegisterComponent} from './auth/register/register.component';
import {LoginComponent} from './auth/login/login.component';
import {HomeComponent} from './home/home.component';


const routes: Routes = [
  // {path: '', redirectTo: 'user', pathMatch: 'full'},
  {path: 'auth/register', component:RegisterComponent},
  {path: 'auth/login', component:LoginComponent},
  {path: '', component:HomeComponent},
  {path: '**', redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
