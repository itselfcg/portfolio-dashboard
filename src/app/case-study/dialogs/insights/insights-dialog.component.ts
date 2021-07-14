import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Insight } from 'src/app/_models/insight.model';

@Component({
  selector: 'insights-dialog',
  templateUrl: 'insights-dialog.html',
  styleUrls: ['insights-dialog.scss'],
})
export class InsightDialog implements OnInit {
  form: FormGroup;
  imagePreview: string;

  constructor(
    public dialogRef: MatDialogRef<InsightDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Insight
  ) {
    this.form = new FormGroup({
      title: new FormControl(this.data.title, { validators: [Validators.required] }),
      content: new FormControl(this.data.content, { validators: [Validators.required] }),
      icon: new FormControl(this.data.icon, { validators: [Validators.required] }),
   });
  }

  ngOnInit() {}

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    let insight: Insight = {
      title: this.form.value.title,
      content: this.form.value.content,
      icon: this.form.value.icon
    };

    this.dialogRef.close(insight);
  }

  close() {
    this.dialogRef.close();
  }
}
