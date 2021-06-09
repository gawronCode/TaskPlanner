import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {map} from 'rxjs/operators'
import { userDto } from '../_models/user';
import { Observable, ReplaySubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSource = new ReplaySubject<userDto>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  LoginURL = 'authentication/authenticate';
  RegisterURL = 'authentication/RegisterUser';
  GetURL = 'authentication/Get';

  login(model: any){
    return this.http.post<userDto>(environment.apiURL + this.LoginURL, model).pipe(
      map((response: userDto) => {
        const user = response;
        if (user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }

  get(): Observable<any> {
    const token: any = JSON.parse(localStorage.getItem('user') as any)?.token;
    const header: HttpHeaders = new HttpHeaders().set("Authorization", "Bearer "+token)
    return this.http.get(environment.apiURL + this.GetURL, {
      headers: header
    });
  }

  setCurrentUser(user: userDto){
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null as any);
  }

  register(model: any){
    return this.http.post(environment.apiURL + this.RegisterURL, model);
  }

}
