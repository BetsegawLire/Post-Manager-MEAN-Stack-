import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token!: string | null;
  authStatusListener = new Subject<boolean>()
  isAuthenticated = false
  tokenTimer!: NodeJS.Timer
  userId!: string | null;

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token
  }

  getIsAuth() {
    return this.isAuthenticated
  }

  getUserId() {
    return this.userId
  }

  getAuthStatusListner() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email, password: password
    }
    this.http.post(BACKEND_URL + "/signup", authData)
    .subscribe(response => {
      console.log(response)
    })
  }

  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password}
    this.http.post<{token: string, expiresIn: number, userId: string}>(BACKEND_URL + "/login", authData)
    .subscribe(response => {
      console.log(response)
      const token = response.token
      this.token = token
      if(token) {
        const expiresInDuration = response.expiresIn
        console.log(expiresInDuration)
        this.setAuthTimer(expiresInDuration)
        this.isAuthenticated = true
        this.userId = response.userId
        this.authStatusListener.next(true)
        const now = new Date()
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000)
        console.log(expirationDate)
        this.saveAuthData(token, expirationDate, this.userId)
        this.router.navigate(['/'])
      }
    })
  }

  autoAuthUser() {
    const authInformation = this.getAuthData()
    if(!authInformation) {
      return
    }
    const now = new Date()
    const expiresIn  = authInformation!.expirationDate.getTime() - now.getTime()
    if(expiresIn > 0) {
      this.token = authInformation!.token
      this.isAuthenticated = true
      this.userId = authInformation.userId
      this.setAuthTimer(expiresIn / 1000)
      this.authStatusListener.next(true)
    }
  }

  logout() {
    this.token = null
    this.isAuthenticated = false
    this.authStatusListener.next(false)
    clearTimeout(this.tokenTimer)
    this.clearAuthData()
    this.userId = null
    this.router.navigate(['/'])
  }

  private setAuthTimer(expiresInDuration: number) {
    console.log("Setting timer: " + expiresInDuration)
    this.tokenTimer =  setTimeout(() => {
      this.logout()
    }, expiresInDuration * 1000)
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token)
    localStorage.setItem('expiration', expirationDate.toISOString())
    localStorage.setItem('userId', userId)
  }

  private clearAuthData() {
    localStorage.removeItem('token')
    localStorage.removeItem('expiration')
    localStorage.removeItem('userId')
  }

  private getAuthData() {
    const token = localStorage.getItem('token')
    const expirationDate = localStorage.getItem('expiration')
    const userId = localStorage.getItem('userId')
    if(!token || !expirationDate) {
      return null
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
