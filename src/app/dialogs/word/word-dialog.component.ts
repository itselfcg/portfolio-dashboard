import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Word } from 'src/app/_models/word.model';
import { ItemsDialog } from '../items/items-dialog.component';

@Component({
  selector: 'app-word-dialog',
  templateUrl: './word-dialog.component.html',
})
export class WordDialog implements OnInit {
  form: FormGroup;
  selectedSection: string = '';
  constructor(
    public dialogRef: MatDialogRef<ItemsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Word
  ) {
    this.form = new FormGroup({
      key: new FormControl(this.data.key, {
        validators: [Validators.required],
      }),
      value: new FormControl(this.data.value, {
        validators: [Validators.required],
      }),
    });
    this.selectedSection = this.data.section;
    if (data.key) {
      this.form.controls['key'].disable();
    }
  }

  ngOnInit(): void {}

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.form.controls['key'].enable();

    let item: Word = {
      section: this.selectedSection,
      key: this.form.value.key,
      value: this.form.value.value,
    };
    this.dialogRef.close(item);
  }

  close() {
    this.form.controls['key'].enable();

    this.dialogRef.close();
  }
}
