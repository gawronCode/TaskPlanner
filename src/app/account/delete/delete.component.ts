import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, 
    private authService: AuthService,
    private router: Router,
    private accountService: AccountService) { }


    form: any;

    ngOnInit(): void {
      this.form = this.formBuilder.group({
        password: ['', {
          validators: [Validators.required]
        }]
      });
    }

    getErrorFieldPassword(): string {
      const field = this.form.get('password');
      if(field?.hasError('required')){
        return "Usunięcie konta należy potwierdzić hasłem"
      }
  
      return ''
    }

    delete(){
      this.accountService.DeleteAccount(this.form.value).subscribe(()=>{
        this.authService.logout();
        this.router.navigate(['']);
      })
    }

}
