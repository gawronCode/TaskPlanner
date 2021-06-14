import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http:HttpClient, private authService: AuthService) { }

  GetAllURL = 'Events/GetAllEvents'


  getAllEvents(): Observable<any> {
    const token: any = JSON.parse(localStorage.getItem('user') as any)?.token;
    const header: HttpHeaders = new HttpHeaders().set("Authorization", "Bearer "+token)

    return this.http.get(environment.apiURL + this.GetAllURL, {
      headers: header
    })

  }

}
