import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../models/user.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token?: string | '';
  private authStatusListener = new Subject<boolean>();
  private tokenTimer!: NodeJS.Timer;
  constructor(private http: HttpClient, private router: Router) {}

  createUser(user: IUser) {
    return this.http.post<any>(`${environment.apiUrl}/user/signup`, user);
  }
  login(user: IUser) {
    return this.http.post<any>(`${environment.apiUrl}/user/login`, user);
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getIsAuthenticated() {
    const authInformation = this.getAuthData();
    if (authInformation == null) {
      this.authStatusListener.next(false);
      this.setToken('');
    } else {
      this.authStatusListener.next(true);
      return true;
    }

    return false;
  }
  getToken() {
    return localStorage.getItem('token');
  }
  getUserId() {
    return localStorage.getItem('userId');
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (authInformation == null) {
      this.setToken('');
    } else {
      const now = new Date();
      const exporesIn =
        authInformation!.expirationDate.getTime() - now.getTime();
      if (exporesIn > 0) {
        this.setDataTimeOut(exporesIn);
        this.token = authInformation!.token;
        this.authStatusListener.next(true);
      } else {
      }

      this.setToken('');
    }
  }
  setDataTimeOut(time: number) {
    this.tokenTimer = setTimeout(() => {
      this.setToken('');
    }, time * 1000);
  }
  setToken(token: string) {
    this.token = token;

    if (this.token) {
      this.authStatusListener.next(true);
    } else {
      this.authStatusListener.next(false);
      clearTimeout(this.tokenTimer);
      this.clearAuthData();
      this.router.navigate(['/auth/login']);
    }
  }
  saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    var decodeToken: any = jwt_decode(token);
    localStorage.setItem('userId', decodeToken.userId);
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    this.authStatusListener.next(false);
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expiration) return null;
    return {
      token: token,
      expirationDate: new Date(expiration),
      userId: userId,
    };
  }
}
