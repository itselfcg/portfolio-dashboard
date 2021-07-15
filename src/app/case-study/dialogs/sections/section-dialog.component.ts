import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { mimeType } from 'src/app/mime-type.validator';
import { Section } from 'src/app/_models/section.model';

@Component({
  selector: 'section-dialog',
  templateUrl: 'section-dialog.html',
  styleUrls: ['section-dialog.scss'],
})
export class SectionDialog implements OnInit {
  form: FormGroup;
  imagePreview: string;
  sectionsAvailable: string[];
  constructor(
    public dialogRef: MatDialogRef<SectionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Section
  ) {
    this.form = new FormGroup({
      name: new FormControl(this.data.name, {
        validators: [Validators.required],
      }),
      title: new FormControl(this.data.title, {
        validators: [Validators.required],
      }),
      content: new FormControl(this.data.content, {
        validators: [Validators.required],
      }),
      questions: new FormControl(this.data.questions, {
        validators: [Validators.required],
      }),
      list: new FormControl(this.data.list, {
        validators: [Validators.required],
      }),
      /*  pictures: new FormControl(this.data.pictures, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }), */
    });

    this.sectionsAvailable=data.sections;
  }

  ngOnInit() {}

  save() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    var section: Section = {
      name: this.form.value.name,
      title: this.form.value.title,
      content: this.form.value.content,
      questions: this.form.value.questions,
      list: this.form.value.list,
      pictures: null,
      sections: null,
    };

    this.dialogRef.close(section);
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
