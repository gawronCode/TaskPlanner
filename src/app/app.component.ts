import { Component, OnInit } from '@angular/core';
import { userDto } from './_models/user';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor(private authService: AuthService){}



  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const user: userDto = JSON.parse(localStorage.getItem('user') as any);
    this.authService.setCurrentUser(user);
  }



  title = 'TaskPlanner';
}
