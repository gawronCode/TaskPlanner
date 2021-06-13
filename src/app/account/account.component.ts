import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MenuComponent } from '../menu/menu.component';
import { MustMatch } from '../_helpers/password-match.validator';
import { AccountService } from '../_services/account.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private authService: AuthService,
              private toastr: ToastrService, 
              private accountService: AccountService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.accountService.get().subscribe(data=>{
        this.userName = data.name;
        this.email = data.email;
    })
  }

  formName: any;
  formEmail: any;
  formPassword: any;

  userName: any;
  email: any;

  nameEdit: boolean = false;
  emailEdit: boolean = false;
  passwordEdit: boolean = false;

  toogleNameEdit(){

    this.formName = this.formBuilder.group({
      name: [this.userName, {
        validators: [Validators.required, Validators.minLength(3)]
      }]
    });

    this.nameEdit = !this.nameEdit;
    this.emailEdit = false;
    this.passwordEdit = false;
  }

  saveNameChange(){

    if(this.formName.value.name != this.userName){

      this.accountService.UpdateName(this.formName.value).subscribe(() => {

        this.ngOnInit();

      })
      this.toastr.success("Nick został zmieniony")
      this.toogleNameEdit();
      return;
    }
    this.toastr.info("Nie dokonano zmiany nicku")
    this.toogleNameEdit();
  }

  getErrorFieldName(): string{
    const field = this.formName.get('name');

    if(field?.hasError('required')){
      return "Nick jest wymagany"
    } else if (field?.hasError('minlength')){
      return "Nick musi mieć przynajmniej 3 znaki"
    }

    return "";
  }

  toogleEmailEdit(){

    this.formEmail = this.formBuilder.group({
      email: [this.email, {
        validators: [Validators.required, Validators.email]
      }]
    });

    this.emailEdit = !this.emailEdit;
    this.nameEdit = false;
    this.passwordEdit = false;
  }

  saveEmailChange(){
    if(this.formEmail.value.email != this.email){
      this.accountService.UpdateEmail(this.formEmail.value).subscribe(() => {
        this.ngOnInit();
      })
      this.toastr.success("Adres email został zmieniony");
      this.toogleEmailEdit();
      return;
    }
    this.toastr.info("Nie dokonano zmiany adresu email");
    this.toogleEmailEdit();
  }

  getErrorFieldEmail(): string{
    const field = this.formEmail.get('email');

    if(field?.hasError('required')){
      return "Email jest wymagany"
    } else if (field?.hasError('email')){
      return "Podany email jest niepoprawny"
    }

    return "";
  }

  tooglePasswordEdit(){

    this.formPassword = this.formBuilder.group({
      password: ["", {
        validators: [Validators.required, Validators.minLength(6)]
      }],
      repeatPassword: ["", {
        validators: [Validators.required, Validators.minLength(6)]
      }],
    }, {
      validator: MustMatch('password', 'repeatPassword')
    });

    this.passwordEdit = !this.passwordEdit;
    this.nameEdit = false;
    this.emailEdit= false;
  }

  savePasswordChange(){
    
    this.accountService.UpdatePassword({password: this.formPassword.get('password').value}).subscribe(() => {
      this.toastr.success("Hasło zostało zmienione");
      this.ngOnInit();
    });
    
    

    this.tooglePasswordEdit();
  }

  getErrorFieldPassword(): string {
    const field = this.formPassword.get('password');

    if(field?.hasError('required')){
      return "Hasło nie może być puste"
    } else if (field?.hasError('minlength')){
      return "Hasło musi zawierać przynajmniej 6 znaków"
    }

    return "";
  }

  getErrorFieldRepeatPassword(): string{
    const field = this.formPassword.get('repeatPassword');

    if (field?.hasError('required')){
      return 'Pole nie może być puste'
    }

    return 'Hasło nie zgadza się z powtórzeniem'
  }

  delete(){
    this.router.navigate(['account/delete']);
  }

}
