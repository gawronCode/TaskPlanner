import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router,
              private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if(error.status == 0){
          this.toastr.error("Serwer czasowo niedostępny");
        } else if (error.status == 401){
          this.toastr.error("Zaloguj się aby uzyskać dostęp");
          this.router.navigate(['auth/login'])
        } else if (error.status == 500){
          this.toastr.error("Ten adres email jest już zajęty");
        } else if (error.status == 400){
          this.toastr.error("Niepoprawne hasło");
        }
        return throwError(error);
      })
    );
  }
}
