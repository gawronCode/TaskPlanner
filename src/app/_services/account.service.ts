import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { userDto } from '../_models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  
  constructor(private http: HttpClient, private authService: AuthService) { }

  GetURL = 'Account/Get';
  UpdateNameURL = 'Account/UpdateName';
  UpdateEmailURL = 'Account/UpdateEmail';
  DeleteAccountURL = 'Account/DeleteAccount';

  get(): Observable<any> {
    const token: any = JSON.parse(localStorage.getItem('user') as any)?.token;
    const header: HttpHeaders = new HttpHeaders().set("Authorization", "Bearer "+token)
    return this.http.get(environment.apiURL + this.GetURL, {
      headers: header
    });
  }

  UpdateName(name: any) {
    const token: any = JSON.parse(localStorage.getItem('user') as any)?.token;
    const header: HttpHeaders = new HttpHeaders().set("Authorization", "Bearer "+token)

    return this.http.put(environment.apiURL + this.UpdateNameURL, name ,{
      headers: header
    });
  }

  UpdateEmail(email: any) {
    const token: any = JSON.parse(localStorage.getItem('user') as any)?.token;
    const header: HttpHeaders = new HttpHeaders().set("Authorization", "Bearer "+token)

    return this.http.put<userDto>(environment.apiURL + this.UpdateEmailURL, email ,{
      headers: header
    }).pipe(
      map((response: userDto) => {
        const user = response;
        if (user){
          localStorage.setItem('user', JSON.stringify(user));
          this.authService.currentUserSource.next(user);
        }
      })
    );
  }

  DeleteAccount(): Observable<any> {
    const token: any = JSON.parse(localStorage.getItem('user') as any)?.token;
    const header: HttpHeaders = new HttpHeaders().set("Authorization", "Bearer "+token)
    return this.http.get(environment.apiURL + this.GetURL, {
      headers: header
    });
  }

}
