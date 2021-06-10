import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private authService: AuthService, 
              private accountService: AccountService,
              private formBuilder: FormBuilder) { }

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
    }
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
      this.accountService.UpdateEmail(this.formEmail.value).subscribe(data => {
        console.log(data);
        this.ngOnInit();
      })
    }
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
    });

    this.passwordEdit = !this.passwordEdit;
    this.nameEdit = false;
    this.emailEdit= false;
  }


}
