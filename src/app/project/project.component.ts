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
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ItemsDialog } from '../case-study/dialogs/items/items-dialog.component';

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
  imagePreview: string;

  labels: string[] = [];
  labelsColumns: any[] = ['name', 'actions'];
  labelsDataSource = new MatTableDataSource(this.labels);

  constructor(
    public dialog: MatDialog,
    public projectService: ProjectService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      language: new FormControl('en', {
        validators: [Validators.required],
      }),
      name: new FormControl(null, { validators: [Validators.required] }),
      title: new FormControl(null, { validators: [Validators.required] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      git_url: new FormControl(null),
      preview_url: new FormControl(null),
      picture: new FormControl('', {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
      picture_alt: new FormControl(null, { validators: [Validators.required] }),
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
            labels: this.labels,
            git_url: this.project.git_url,
            preview_url: this.project.preview_url,
            picture: this.project.picture.url,
            picture_alt: this.project.picture.description,
          });

          this.imagePreview = this.project.picture.url;
        });
      } else {
        this.mode = 'create';
        this.projectId = null;
      }
    });
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

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.projectService.create(
        this.form.value.language,
        this.form.value.name,
        this.form.value.title,
        this.form.value.content,
        this.form.value.git_url,
        this.form.value.preview_url,
        this.form.value.labels,
        this.form.value.picture,
        this.form.value.picture_alt
      );
    } else {
      this.projectService.update(
        this.projectId,
        this.form.value.language,
        this.form.value.name,
        this.form.value.title,
        this.form.value.content,
        this.form.value.git_url,
        this.form.value.preview_url,
        this.form.value.labels,
        this.form.value.picture,
        this.form.value.picture_alt
      );
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
}
