import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { userDto } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  user: userDto = JSON.parse(localStorage.getItem('user') as any);

  loggedIn: boolean = false;
  userName: string = '';

  constructor(public authService: AuthService, 
    public accountService: AccountService,
    private router: Router) { }

  ngOnInit(): void {
    // const user = JSON.parse(localStorage.getItem('user') as any)
    this.authService.currentUser$.subscribe(user =>
      {
        if (user) this.userName = user.user
      })
    
    // if(user) this.userName = user.user;
  }

  logout(){
    this.router.navigate(['/auth/login'])
    this.authService.logout();
  }
 
}
