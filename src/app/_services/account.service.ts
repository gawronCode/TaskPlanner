import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  
  constructor(private http: HttpClient) { }

  GetURL = 'Account/Get';
  UpdateCredentialsURL = 'Account/UpdateCredentials';
  DeleteAccountURL = 'Account/DeleteAccount';

  get(): Observable<any> {
    const token: any = JSON.parse(localStorage.getItem('user') as any)?.token;
    const header: HttpHeaders = new HttpHeaders().set("Authorization", "Bearer "+token)
    return this.http.get(environment.apiURL + this.GetURL, {
      headers: header
    });
  }

  UpdateCredentials(update: any) {
    const token: any = JSON.parse(localStorage.getItem('user') as any)?.token;
    const header: HttpHeaders = new HttpHeaders().set("Authorization", "Bearer "+token)

    return this.http.put(environment.apiURL + this.UpdateCredentialsURL, update ,{
      headers: header
    });
  }

  DeleteAccount(): Observable<any> {
    const token: any = JSON.parse(localStorage.getItem('user') as any)?.token;
    const header: HttpHeaders = new HttpHeaders().set("Authorization", "Bearer "+token)
    return this.http.get(environment.apiURL + this.GetURL, {
      headers: header
    });
  }

}
