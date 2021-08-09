import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth/auth.service';
import { StatusDialog } from '../dialogs/status/status-dialog.component';
import { CustomErrorStateMatcher } from '../_error/custom-error.state-matcher';
import { User } from '../_models/user.model';
import { RoleAuthService } from '../_services/role-auth.service';
import { UserService } from '../_services/user.service';
import { passwordMatch } from '../_validator/file.directive';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  public matcher = new CustomErrorStateMatcher();
  user: string;
  form: FormGroup;
  isLoading = false;

  constructor(
    public userService: UserService,
    private authService: AuthService,
    public dialog: MatDialog,
    private readonly auth: RoleAuthService
  ) {}

  ngOnInit(): void {
    const authData = this.authService.getAuthUser();
    this.user = authData.username;
    this.form = new FormGroup(
      {
        user: new FormControl(
          { value: this.user, disabled: true },
          { validators: [Validators.required] }
        ),
        password: new FormControl(null, { validators: [Validators.required] }),
        newPassword: new FormControl(null, {
          validators: [Validators.required],
        }),
        confirmPassword: new FormControl(null, {
          validators: [Validators.required],
        }),
      },
      { validators: passwordMatch.bind(this) }
    );
  }

  onUpdateUser() {
    this.isLoading = true;
    if (this.form.invalid) {
      this.isLoading = false;
      return;
    }
    this.userService
      .changePassword(
        this.user,
        this.form.value.password,
        this.form.value.newPassword
      )
      .subscribe(
        (result) => {
          this.isLoading = false;
          this.form.reset();
          this.form.get('user').setValue(this.user);
          this.dialog
            .open(StatusDialog, {
              data: true,
            })
            .afterClosed()
            .subscribe((confirmation: Boolean) => {});
        },
        (error) => {
          this.isLoading = false;
          this.form.setValue({
            user: this.user,
            password: '',
            newPassword: '',
            confirmPassword: '',
          });
          this.dialog
            .open(StatusDialog, {
              data: false,
            })
            .afterClosed()
            .subscribe((confirmation: Boolean) => {});
        }
      );
  }

  public get canEdit(): boolean {
    return this.auth.isAdmin();
  }
}
