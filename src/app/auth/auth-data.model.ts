import { Role } from '../_enums/role.enum';

export interface AuthData {
  role: Role;
  name: string;
  username: string;
  password: string;
  newPassword: string;
  token?: string;
}
