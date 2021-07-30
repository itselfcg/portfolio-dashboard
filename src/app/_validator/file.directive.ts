import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const pictureSelectedValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const url = control.get('url');
  const file = control.get('file');
  return url.value === '' && !file.value ? { pictureSelected: true } : null;
};

export const passwordMatch: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const newPassword = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');
  return newPassword.value !== confirmPassword.value
    ? { validPassword: true }
    : null;
};
