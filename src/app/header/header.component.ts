import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{

  authListenerSubs!: Subscription;
  userIsAuthenticated=  false

  constructor(private authService: AuthService) {}
  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe()
  }
  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth()
   this.authListenerSubs = this.authService
    .getAuthStatusListner()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated
    })
  }

  onLogout() {
    this.authService.logout()
  }


}
