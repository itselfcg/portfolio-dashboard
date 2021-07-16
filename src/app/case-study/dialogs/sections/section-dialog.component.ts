import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { mimeType } from 'src/app/mime-type.validator';
import { Picture } from 'src/app/_models/picture.model';
import { Section } from 'src/app/_models/section.model';
import { PictureDialog } from '../picture/picture-dialog.component';

@Component({
  selector: 'section-dialog',
  templateUrl: 'section-dialog.html',
  styleUrls: ['section-dialog.scss'],
})
export class SectionDialog implements OnInit {
  form: FormGroup;
  imagePreview: string;
  sectionsAvailable: string[];
  pictures: Picture[] = [];
  picturesColumns: any[] = ['name', 'description', 'picture', 'actions'];
  picturesDataSource = new MatTableDataSource(this.pictures);

  constructor(
    public dialog: MatDialog,
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
      questions: new FormControl(this.data.questions),
      list: new FormControl(this.data.list),
    });

    if (data.pictures) {
      this.pictures = data.pictures;
      this.picturesDataSource = new MatTableDataSource(this.pictures);
    } else {
      this.pictures = [];
    }

    this.sectionsAvailable = data.sections;
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
      pictures: this.pictures,
      sections: null,
    };

    this.dialogRef.close(section);
  }

  close() {
    this.dialogRef.close();
  }

  openPictureDialog(picture: Picture): void {
    var mode = 'update';

    if (!picture) {
      mode = 'create';
      picture = {
        fileName: null,
        description: null,
        url: null,
        file: null,
      };
    }

    const dialogRef = this.dialog.open(PictureDialog, {
      width: '450px',
      data: {
        fileName: picture.fileName,
        description: picture.description,
        url: picture.url,
        file: picture.file,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (mode === 'create') {
          this.pictures.push(result);
        } else {
          var index = this.pictures.indexOf(picture);
          this.pictures[index] = result;
        }
        this.picturesDataSource = new MatTableDataSource(this.pictures);
      }
    });
  }

  onDeletePicture(picture: Picture) {
    this.pictures = this.pictures.filter(
      (result) => result.fileName !== picture.fileName
    );
    this.picturesDataSource = new MatTableDataSource(this.pictures);
  }
}