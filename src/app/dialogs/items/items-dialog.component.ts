import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Insight } from 'src/app/_models/insight.model';

@Component({
  selector: 'items-dialog',
  templateUrl: 'items-dialog.html',
  styles: [`
    .mat-column-name {
      width: 75% !important;
      word-break: break-word;
    }
    .mat-column-actions {
      width: 25% !important;
      word-break: break-word;
    }
  `]
})
export class ItemsDialog implements OnInit {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ItemsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: String
  ) {
    this.form = new FormGroup({
      content: new FormControl(this.data, {
        validators: [Validators.required],
      }),
    });
  }

  ngOnInit() {}

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    let item: String = this.form.value.content.trim();
    this.dialogRef.close(item);
  }

  close() {
    this.dialogRef.close();
  }
}
