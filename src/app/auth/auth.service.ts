import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';

import { environment } from 'src/environments/environment';
const API_URL = environment.apiUrl + '/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  login(user: string, password: string) {
    const authData: AuthData = {
      name: user,
      password: password,
      newPassword: '',
    };
    this.http
      .post<{ token: string; expiresIn: number }>(
        API_URL + '/login',
        authData,
        {
          observe: 'response',
        }
      )
      .subscribe(
        (response) => {
          const token = response.body.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.body.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(token, user, expirationDate);
            const authInformation = this.getAuthData();
            console.log(authInformation);
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, user: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', user);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    console.log(localStorage.getItem('token'));
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('expiration');
    console.log(localStorage.getItem('token'));
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return null;
    }
    return {
      token: token,
      user: user,
      expirationDate: new Date(expirationDate),
    };
  }

  getAuthUser() {
    const user = localStorage.getItem('user');
    return {
      user: user,
    };
  }
}
