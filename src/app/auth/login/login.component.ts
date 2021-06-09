import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { userDto } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(private formBuilder: FormBuilder, 
              private authService: AuthService,
              private router: Router) { }

  form: any;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', {
        validators: [Validators.required, Validators.email]
      }],
      password: ['', {
        validators: [Validators.required]
      }]
    });

    const user = JSON.parse(localStorage.getItem('user') as any)
    if(user) this.router.navigate(['']);
  }

  login() {
    this.authService.login(this.form.value).subscribe(data => {
      this.router.navigate(['']);
    });

  }

  getErrorFieldEmail(): string {
    const field = this.form.get('email');
    if(field?.hasError('required')){
      return "Proszę podać adres email"
    } else if (field?.hasError('email')){
      return "Adres email jest niepoprawny"
    }

    return ''
  }

  getErrorFieldPassword(): string {
    const field = this.form.get('password');
    if(field?.hasError('required')){
      return "Proszę podać hasło"
    }

    return ''
  }


}
