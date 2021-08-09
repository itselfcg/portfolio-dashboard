import { Injectable } from '@angular/core';
import { AuthData } from '../auth/auth-data.model';
import { AuthService } from '../auth/auth.service';
import { Role } from '../_enums/role.enum';

@Injectable({ providedIn: 'root' })
export class RoleAuthService {
  user: AuthData;

  constructor(private authService: AuthService) {
    this.user = this.authService.getAuthUser();
  }

  isAdmin() {
    if (this.user.role === Role.Admin) return true;
    return false;
  }
}
