import { Component } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PasswordErrorStateMatcher } from 'src/app/_error/custom-error.state-matcher';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private authStatusSub: Subscription;
  form: FormGroup;
  public matcher = new PasswordErrorStateMatcher();
  isLoading = false;

  showCaptcha: boolean = false;
  successCaptcha: boolean = false;
  siteKey: string = environment.siteKey;

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
      recaptcha: new FormControl(null, { validators: [Validators.required] }),
    });
  }
  onLogin() {
    if (this.form.invalid) {
      this.successCaptcha = false;
      this.showCaptcha = false;
      return;
    }
    this.isLoading = true;
    this.authService.login(this.form.value.user, this.form.value.password);
  }

  onPasswordKeyPressed(event: any) {
    this.showCaptcha = true;
  }
}
