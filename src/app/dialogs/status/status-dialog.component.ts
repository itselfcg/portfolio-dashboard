import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'status-dialog',
  templateUrl: 'status-dialog.component.html',
  styleUrls:['status-dialog.component.scss']
})
export class StatusDialog implements OnInit {
  form: FormGroup;
  success = false;
  constructor(
    public dialogRef: MatDialogRef<StatusDialog>,
    @Inject(MAT_DIALOG_DATA) public status: boolean
  ) {
    this.success = status;
  }

  ngOnInit() {
    this.dialogRef.updateSize('200px');
  }
  close() {
    this.dialogRef.close('');
  }
}
