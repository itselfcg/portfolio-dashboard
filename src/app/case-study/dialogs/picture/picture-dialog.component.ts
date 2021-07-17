import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { mimeType } from 'src/app/mime-type.validator';
import { Picture } from 'src/app/_models/picture.model';

@Component({
  selector: 'picture-dialog',
  templateUrl: 'picture-dialog.html',
  styleUrls: ['../../case-study.component.scss'],
})
export class PictureDialog implements OnInit {
  form: FormGroup;
  imagePreview: string;

  constructor(
    public dialogRef: MatDialogRef<PictureDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Picture
  ) {
    this.form = new FormGroup({
      name: new FormControl(this.data.fileName, {
        validators: [Validators.required],
      }),
      description: new FormControl(this.data.description, {
        validators: [Validators.required],
      }),
      file: new FormControl(this.data.url, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      })
    });
    console.log();


    this.imagePreview = this.data.url;


  }

  ngOnInit() {}

  save() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }
    let picture: Picture = {
      fileName: this.form.value.name,
      description: this.form.value.description,
      url: this.imagePreview,
      file: this.form.value.file,
    };
    this.dialogRef.close(picture);
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
