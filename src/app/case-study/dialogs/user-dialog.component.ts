import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { mimeType } from 'src/app/mime-type.validator';
import { User } from 'src/app/_models/user.model';

@Component({
  selector: 'user-dialog',
  templateUrl: 'user-dialog.html',
  styleUrls: ['user-dialog.scss'],
})
export class UserDialog implements OnInit {
  form: FormGroup;
  imagePreview: string;



  constructor(
    public dialogRef: MatDialogRef<UserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {

    this.form = new FormGroup({
      name: new FormControl(this.data.name, { validators: [Validators.required] }),
      age: new FormControl(this.data.age, { validators: [Validators.required] }),
      occupation: new FormControl(this.data.occupation, { validators: [Validators.required] }),
      story: new FormControl(this.data.story, { validators: [Validators.required] }),
      picture: new FormControl(this.data.pictures.url, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
      picture_alt: new FormControl(this.data.pictures.description, { validators: [Validators.required] }),
    });

    this.imagePreview=this.data.pictures.url;
  }

  ngOnInit() {}

  save() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    let user: User = {
      name: this.form.value.name,
      age: this.form.value.age,
      story: this.form.value.story,
      occupation: this.form.value.occupation,
      pictures: {
        url: this.imagePreview,
        description: this.form.value.picture_alt,
      },
      file:this.form.value.picture
    };

    this.dialogRef.close(user);
  }

  close() {
    this.dialogRef.close();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ picture: file });
    this.form.get('picture').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
