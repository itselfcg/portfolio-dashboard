import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { mimeType } from 'src/app/mime-type.validator';
import { CustomErrorStateMatcher } from 'src/app/_error/picture-error.state-matcher';
import { User } from 'src/app/_models/user.model';
import { pictureSelectedValidator } from 'src/app/_validator/file.directive';

@Component({
  selector: 'user-dialog',
  templateUrl: 'user-dialog.html',
  styleUrls: ['user-dialog.component.scss'],
})
export class UserDialog implements OnInit {
  form: FormGroup;
  imagePreview: string;
  imagePreviewName: string;
  tabSelected = 0;
  public matcher = new CustomErrorStateMatcher();

  constructor(
    public dialogRef: MatDialogRef<UserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.form = new FormGroup(
      {
        name: new FormControl(this.data.name, {
          validators: [Validators.required],
        }),
        age: new FormControl(this.data.age, {
          validators: [Validators.required],
        }),
        occupation: new FormControl(this.data.occupation, {
          validators: [Validators.required],
        }),
        story: new FormControl(this.data.story, {
          validators: [Validators.required],
        }),
        file: new FormControl(
          this.data.picture.file ? this.data.picture.file : '',
          {
            asyncValidators: [mimeType],
          }
        ),
        fileName: new FormControl(this.data.picture.fileName, {
          validators: [Validators.required],
        }),
        url: new FormControl(
          this.data.picture.file ? '' : this.data.picture.url
        ),
        key: new FormControl(this.data.picture.key),
        fileDescription: new FormControl(this.data.picture.description, {
          validators: [Validators.required],
        }),
      },
      { validators: pictureSelectedValidator.bind(this) }
    );
    if (this.data.picture.file) {
      this.form.get('url').disable();
    }
    this.imagePreview = this.data.picture.url;
  }

  ngOnInit() {}

  save() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.tabSelected = 1;
      return;
    }

    let user: User = {
      name: this.form.value.name,
      age: this.form.value.age,
      story: this.form.value.story,
      occupation: this.form.value.occupation,
      picture: {
        fileName: this.form.value.fileName,
        description: this.form.value.fileDescription,
        url: this.form.value.file ? this.imagePreview : this.form.value.url,
        file: this.form.value.file,
        key: this.form.value.key,
      },
    };
    this.dialogRef.close(user);
  }

  close() {
    this.dialogRef.close();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ file: file });
    this.form.get('file').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.imagePreviewName = file.name;
    };
    this.form.patchValue({ fileName: file.name.split('.')[0] });
    this.form.patchValue({ url: '' });
    this.form.get('url').disable();
    this.form.get('url').updateValueAndValidity();

    reader.readAsDataURL(file);
  }
  removePicture() {
    this.imagePreview = '';
    this.imagePreviewName = '';
    this.form.patchValue({ file: '' });
    this.form.patchValue({ url: '' });
    this.form.get('url').enable();
  }
}
