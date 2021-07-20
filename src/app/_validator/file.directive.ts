import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const pictureSelectedValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const url = control.get('url');
  const file = control.get('file');
  return url.value === '' && !file.value ? { pictureSelected: true } : null;
};


