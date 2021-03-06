import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RegisterComponent} from './auth/register/register.component';
import {LoginComponent} from './auth/login/login.component';
import { AccountComponent } from './account/account.component';
import { DeleteComponent } from './account/delete/delete.component';
import { TasksComponent } from './tasks/tasks.component';


const routes: Routes = [
  // {path: '', redirectTo: 'user', pathMatch: 'full'},
  {path: 'auth/register', component:RegisterComponent},
  {path: 'auth/login', component:LoginComponent},
  {path: 'account', component:AccountComponent},
  {path: 'account/delete', component:DeleteComponent},
  {path: 'tasks', component:TasksComponent},
  {path: '', component:TasksComponent},
  {path: '**', redirectTo:'tasks'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
