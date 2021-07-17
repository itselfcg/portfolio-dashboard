import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Picture } from 'src/app/_models/picture.model';
import { Section } from 'src/app/_models/section.model';
import { ItemsDialog } from '../../../dialogs/items/items-dialog.component';
import { PictureDialog } from '../../../dialogs/picture/picture-dialog.component';

@Component({
  selector: 'section-dialog',
  templateUrl: 'section-dialog.html',
  styleUrls: ['../../case-study.component.scss','section-dialog.scss'],
})
export class SectionDialog implements OnInit {
  form: FormGroup;
  imagePreview: string;
  sectionsAvailable: string[];
  pictures: Picture[] = [];
  items: string[] = [];

  itemsColumns: any[] = ['name', 'actions'];
  picturesColumns: any[] = ['name', 'description', 'picture', 'actions'];

  picturesDataSource = new MatTableDataSource(this.pictures);
  itemsDataSource = new MatTableDataSource(this.items);

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
      content: new FormControl(this.data.content),
    });

    if (data.pictures) {
      this.pictures = data.pictures;
      this.picturesDataSource = new MatTableDataSource(this.pictures);
    } else {
      this.pictures = [];
    }

    this.items = data.list ? data.list : [];
    this.itemsDataSource = new MatTableDataSource(this.items);

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
      list: this.items,
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

  openItemDialog(item: string) {
    var mode = 'update';

    if (!item) {
      mode = 'create';
      item = '';
    }

    const dialogRef = this.dialog.open(ItemsDialog, {
      width: '450px',
      data: item,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (mode === 'create') {
          this.items.push(result);
        } else {
          var index = this.items.indexOf(item);
          this.items[index] = result;
        }
        this.itemsDataSource = new MatTableDataSource(this.items);
      }
    });
  }
  onDeleteListItem(item: string) {
    this.items = this.items.filter((r) => r !== item);
    this.itemsDataSource = new MatTableDataSource(this.items);
  }
}
