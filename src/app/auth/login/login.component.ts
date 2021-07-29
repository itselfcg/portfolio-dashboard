import { Component } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PasswordErrorStateMatcher } from 'src/app/_error/custom-error.state-matcher';

import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private authStatusSub: Subscription;
  form: FormGroup;
  public matcher = new PasswordErrorStateMatcher();

  isLoading = false;
  constructor(public authService: AuthService) {}
  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
        this.form.get('password').setValue('');
      });
    this.form = new FormGroup({
      user: new FormControl(null, { validators: [Validators.required] }),
      password: new FormControl(null, { validators: [Validators.required] }),
    });
  }
  onLogin() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(this.form.value.user, this.form.value.password);
  }
}
