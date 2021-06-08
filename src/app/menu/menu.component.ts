import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  loggedIn: boolean = false;
  userName: string = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  logout(){
    this.authService.logout();
  }

  getCurrentUser(){
    this.authService.currentUser$.subscribe(user => {
      this.loggedIn = !!user;
      if(user){
        this.userName = user.user;
      }
    })
    console.log(this.loggedIn);
  }
  

}
