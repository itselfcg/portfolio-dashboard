import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { mimeType } from '../mime-type.validator';
import { Project } from '../_models/project.model';
import { User } from '../_models/user.model';
import { CaseStudyService } from '../_services/case-study.service';
import { ProjectService } from '../_services/projects.service';
import { UserDialog } from './dialogs/user-dialog.component';

@Component({
  selector: 'app-case-study',
  templateUrl: './case-study.component.html',
  styleUrls: ['./case-study.component.scss'],
})
export class CaseStudyComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  imagePreview: string;
  mode = 'create';

  projectsAvailabe: Project[];
  insigths: string[] = [];
  users: User[] = [];

  usersDataSource = new MatTableDataSource(this.users);

  user: User = {
    name: '',
    occupation: '',
    story: '',
    age: '',
    pictures: { url: '', description: '' },
    file: new File([''], '', {
      type: '',
    }),
  };

  userColumns: any[] = [
    'name',
    'age',
    'occupation',
    'story',
    'picture',
    'actions',
  ];
  insigthsColumns: any[] = ['id', 'title', 'content', 'icon'];

  constructor(
    public dialog: MatDialog,
    private projectService: ProjectService,
    private caseStudyService: CaseStudyService
  ) {}
  ngOnInit(): void {
    this.projectService.getAllWithoutCaseStudy().subscribe((result) => {
      this.projectsAvailabe = result.project;
    });
    this.form = new FormGroup({
      language: new FormControl('en', {
        validators: [Validators.required],
      }),
      project: new FormControl(null, { validators: [Validators.required] }),
      title: new FormControl(null, { validators: [Validators.required] }),
      content: new FormControl(null, { validators: [Validators.required] }),
    });
  }

  onSaveCaseStudy() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.caseStudyService.create(
        this.form.value.language,
        this.form.value.project,
        this.form.value.title,
        this.form.value.content,
        this.users
      );
    } else {
    }
  }

  openUserDialog(user: User): void {
    var mode = 'update';

    if (!user) {
      mode = 'create';
      user = {
        name: null,
        age: null,
        story: null,
        occupation: null,
        pictures: {
          url: null,
          description: null,
        },
        file: new File([''], '', {
          type: '',
        }),
      };
    }

    const dialogRef = this.dialog.open(UserDialog, {
      width: '450px',
      data: {
        name: user.name,
        age: user.age,
        story: user.story,
        occupation: user.occupation,
        pictures: {
          url: user.pictures.url,
          description: user.pictures.description,
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if ((mode === 'create')) {
          this.users.push(result);
        }else{
          var index=this.users.indexOf(user);
          this.users[index]=result;
        }
        this.usersDataSource = new MatTableDataSource(this.users);
      }
    });
  }

  onDeleteUser(user: User) {
    console.log(user);
    this.users = this.users.filter((result) => result.name !== user.name);
    this.usersDataSource = new MatTableDataSource(this.users);
  }
}
