import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MustMatch } from 'src/app/_helpers/password-match.validator';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: any;

  constructor(private router: Router, 
              private authService: AuthService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      name: ['', {
        validators: [Validators.required, Validators.minLength(5)]
      }],
      email: ['', {
        validators: [Validators.required, Validators.email]
      }],
      password:['', {
        validators: [Validators.required, Validators.minLength(6)]
      }],
      repeatPassword:['', {
        validators: [Validators.required]
      }]
    }, {
      validator: MustMatch('password', 'repeatPassword')
    });

    const user = JSON.parse(localStorage.getItem('user') as any)
    if(user) this.router.navigate(['']);
  }

  getErrorFieldName(): string{
    const field = this.form.get('name');

    if(field?.hasError('required')){
      return 'Proszę podać nick';
    } else if (field?.hasError('minLength')){
      return 'Minimalna długość nicku to 5 znaków';
    }
    return '';
  }

  getErrorFieldEmail(): string{
    const field = this.form.get('email');

    if(field?.hasError('required')){
      return 'Proszę podać email'
    } else if (field?.hasError('email')){
      return 'Adres email jest niepoprawny'
    }

    return ''
  }

  getErrorFieldPassword(): string{
    const field = this.form.get('password');

    if(field?.hasError('required')){
      return 'Proszę podać hasło'
    } else if (field?.hasError('minLength')){
      return 'Hasło musi mieć conajmniej 6 znaków'
    }
    return ''
  }

  getErrorFieldRepeatPassword(): string{
    const field = this.form.get('repeatPassword');

    if (field?.hasError('required')){
      return 'Pole nie może być puste'
    }

    return 'Hasło nie zgadza się z powtórzeniem'
  }

  register(){
    this.authService.register({name: this.form.value.name,
                              email: this.form.value.email,
                              password: this.form.value.password}).subscribe(() => {
                                this.authService.login({email: this.form.value.email,
                                                        password: this.form.value.password}).subscribe(() =>{
                                                          this.router.navigate(['']);
                                                        })
                              })

  }


}
