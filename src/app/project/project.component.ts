import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

import { ProjectService } from '../_services/projects.service';
import { Project } from '../_models/project.model';
import { mimeType } from '../mime-type.validator';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ItemsDialog } from '../dialogs/items/items-dialog.component';
import { Picture } from '../_models/picture.model';
import { PictureDialog } from '../dialogs/picture/picture-dialog.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  project: Project;
  form: FormGroup;
  mode = 'create';
  projectId: string;
  isLoading = false;
  tabSelected=0;

  labels: string[] = [];
  pictures: Picture[] = [];

  labelsColumns: any[] = ['name', 'actions'];
  picturesColumns: any[] = ['name', 'description', 'picture', 'actions'];

  labelsDataSource = new MatTableDataSource(this.labels);
  picturesDataSource = new MatTableDataSource(this.pictures);

  constructor(
    public dialog: MatDialog,
    public projectService: ProjectService,
    public route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      language: new FormControl('en', {
        validators: [Validators.required],
      }),
      name: new FormControl(null, { validators: [Validators.required] }),
      title: new FormControl(null, { validators: [Validators.required] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      git_url: new FormControl(''),
      preview_url: new FormControl(''),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('projectId')) {
        this.mode = 'edit';
        this.projectId = paramMap.get('projectId');
        this.isLoading = true;
        this.projectService.getById(this.projectId).subscribe((postData) => {
          this.isLoading = false;
          this.project = postData.project[0];

          this.form.setValue({
            language: this.project.language,
            name: this.project.name,
            title: this.project.title,
            content: this.project.content,
            git_url: this.project.git_url,
            preview_url: this.project.preview_url,
          });

          this.labels = this.project.labels;
          this.pictures = this.project.pictures;
          this.labelsDataSource = new MatTableDataSource(this.labels);
          this.picturesDataSource = new MatTableDataSource(this.pictures);
        });
      } else {
        this.mode = 'create';
        this.projectId = null;
      }
    });
  }

  onSavePost() {
    this.isLoading = true;
    if (this.form.invalid) {
      this.isLoading = false;
      this.tabSelected=0;
      return;
    }
    if (this.mode === 'create') {
      this.projectService
        .create(
          this.form.value.language,
          this.form.value.name,
          this.form.value.title,
          this.form.value.content,
          this.form.value.git_url,
          this.form.value.preview_url,
          this.labels,
          this.pictures
        )
        .subscribe((result) => {
          this.isLoading = false;
          if (result.status) {
            this.router.navigate(['/']);
          }
        });
    } else {
      this.projectService
        .update(
          this.projectId,
          this.form.value.language,
          this.form.value.name,
          this.form.value.title,
          this.form.value.content,
          this.form.value.git_url,
          this.form.value.preview_url,
          this.labels,
          this.pictures
        )
        .subscribe((result) => {
          this.isLoading = false;
          if (result.status) {
            this.router.navigate(['/']);
          }
        });
    }
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
          this.labels.push(result);
        } else {
          var index = this.labels.indexOf(item);
          this.labels[index] = result;
        }
        this.labelsDataSource = new MatTableDataSource(this.labels);
      }
    });
  }
  onDeleteListItem(item: string) {
    this.labels = this.labels.filter((r) => r !== item);
    this.labelsDataSource = new MatTableDataSource(this.labels);
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
