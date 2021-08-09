import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';

import { environment } from 'src/environments/environment';
import { AuthGuard } from './auth.guard';
import { Role } from '../_enums/role.enum';
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
      username: user,
      password: password,
      name: null,
      newPassword: null,
      role: null,
      token: null,
    };
    this.http
      .post<{ user: AuthData; token: string; expiresIn: number }>(
        API_URL + '/login',
        authData,
        {
          observe: 'response',
        }
      )
      .subscribe(
        (response) => {
          const user: AuthData = response.body.user;
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
      this.token = authInformation.authData.token;
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

  private saveAuthData(
    token: string,
    authData: AuthData,
    expirationDate: Date
  ) {
    localStorage.setItem('username', authData.username);
    localStorage.setItem('name', authData.name);
    localStorage.setItem('role', authData.role);
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');

    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return null;
    }

    var authData: AuthData = {
      username: username,
      password: null,
      name: name,
      newPassword: null,
      role: role as Role,
      token: token,
    };
    return {
      authData: authData,
      expirationDate: new Date(expirationDate),
    };
  }

  getAuthUser() {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');

    var authData: AuthData = {
      username: username,
      password: null,
      name: name,
      newPassword: null,
      role: role as Role,
      token: null,
    };
    return authData;
  }


}
