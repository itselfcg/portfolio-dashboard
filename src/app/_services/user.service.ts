import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { User } from '../_models/user.model';
import { AuthData } from '../auth/auth-data.model';

const API_URL = environment.apiUrl + '/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private user: User;
  private userUpdated = new Subject<{
    user: User;
  }>();
  constructor(private http: HttpClient) {}

  changePassword(user: string, password: string, newPassword: string) {
    const authData: AuthData = {
      username: user,
      password: password,
      newPassword: newPassword,
      name:null,
      role: null,
      token: null
    };
    return this.http.post(API_URL + '/update', authData, {
      observe: 'response',
    });
  }
}
