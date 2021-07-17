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
  styleUrls: ['../../case-study.component.scss'],
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
      file: new FormControl(this.data.pictures.url, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
      fileName: new FormControl(this.data.pictures.fileName, { validators: [Validators.required] }),
      fileDescription: new FormControl(this.data.pictures.description, { validators: [Validators.required] }),

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
        fileName:this.form.value.fileName,
        description: this.form.value.fileDescription,
        url: this.imagePreview,
        file:this.form.value.file
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
    };
    reader.readAsDataURL(file);
  }
}
