import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mimeType } from 'src/app/mime-type.validator';
import { CustomErrorStateMatcher } from 'src/app/_error/picture-error.state-matcher';
import { Picture } from 'src/app/_models/picture.model';
import { pictureSelectedValidator } from 'src/app/_validator/file.directive';

@Component({
  selector: 'picture-dialog',
  templateUrl: 'picture-dialog.html',
  styleUrls: ['picture-dialog.component.scss'],
})
export class PictureDialog implements OnInit {
  form: FormGroup;
  imagePreview: string;
  imagePreviewName: string;
  public matcher = new CustomErrorStateMatcher();

  constructor(
    public dialogRef: MatDialogRef<PictureDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Picture
  ) {
    this.form = new FormGroup(
      {
        name: new FormControl(this.data.fileName, {
          validators: [Validators.required],
        }),
        description: new FormControl(this.data.description, {
          validators: [Validators.required],
        }),
        url: new FormControl(this.data.file ? '' : this.data.url),
        key: new FormControl(this.data.key),
        file: new FormControl(this.data.file ? this.data.file : '', {
          asyncValidators: [mimeType],
        }),
      },
      { validators: pictureSelectedValidator.bind(this) }
    );
    if(this.data.file ){
      this.form.get('url').disable();
    }

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
      url: this.form.value.file ? this.imagePreview : this.form.value.url,
      file: this.form.value.file,
      key:this.form.value.key
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
      this.imagePreviewName = file.name;
    };
    this.form.patchValue({ name: file.name.split('.')[0] });
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
