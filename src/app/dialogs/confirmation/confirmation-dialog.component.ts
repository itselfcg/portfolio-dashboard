import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Confirmation } from 'src/app/_models/confirmation';
import { Insight } from 'src/app/_models/insight.model';

@Component({
  selector: 'confirmation-dialog',
  templateUrl: 'confirmation-dialog.component.html',
  styles: [
    `

    `,
  ],
})
export class ConfirmationDialog implements OnInit {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public confirmation: Confirmation
  ) {
  }

  ngOnInit() {
    this.dialogRef.updateSize('450px');

  }

  confirmYes(){
    this.dialogRef.close(true);
  }
  confirmNo() {
    this.dialogRef.close(false);
  }
  close() {
    this.dialogRef.close('');
  }
}
