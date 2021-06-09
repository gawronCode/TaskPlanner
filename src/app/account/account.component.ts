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
        validators: [Validators.required]
      }]
    });

    this.nameEdit = !this.nameEdit;
    this.emailEdit = false;
    this.passwordEdit = false;
  }

  saveNameChange(){

    if(this.formName.value.name != this.userName){
      this.accountService.UpdateCredentials(this.formName.value).subscribe(() => {
        this.ngOnInit();
      })
    }
    this.toogleNameEdit();
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

  tooglePasswordEdit(){

    this.formPassword = this.formBuilder.group({
      password: ["", {
        validators: [Validators.required, Validators.minLength(6)]
      }]
    });

    this.passwordEdit = !this.passwordEdit;
    this.nameEdit = false;
    this.emailEdit= false;
  }



}
