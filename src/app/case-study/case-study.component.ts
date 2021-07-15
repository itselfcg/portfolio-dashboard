import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { mimeType } from '../mime-type.validator';
import { Insight } from '../_models/insight.model';
import { Picture } from '../_models/picture.model';
import { Project } from '../_models/project.model';
import { Section } from '../_models/section.model';
import { User } from '../_models/user.model';
import { CaseStudyService } from '../_services/case-study.service';
import { ProjectService } from '../_services/projects.service';
import { InsightDialog } from './dialogs/insights/insights-dialog.component';
import { PictureDialog } from './dialogs/picture/picture-dialog.component';
import { SectionDialog } from './dialogs/sections/section-dialog.component';
import { UserDialog } from './dialogs/user/user-dialog.component';

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
  insigths: Insight[] = [];
  users: User[] = [];
  sections: Section[] = [];
  sectionsName: string[] = [];
  sectionsNameAvailable: string[];
  pictures: Picture[] = [];

  usersDataSource = new MatTableDataSource(this.users);
  insightsDataSource = new MatTableDataSource(this.insigths);
  sectionsDataSource = new MatTableDataSource(this.sections);
  picturesDataSource = new MatTableDataSource(this.pictures);

  userColumns: any[] = [
    'name',
    'age',
    'occupation',
    'story',
    'picture',
    'actions',
  ];
  insigthsColumns: any[] = ['icon', 'title', 'content', 'actions'];
  picturesColumns: any[] = ['name', 'description', 'picture', 'actions'];

  sectionsColumns: any[] = [
    'name',
    'title',
    'content',
    'questions',
    'list',
    'actions',
  ];

  constructor(
    public dialog: MatDialog,
    private projectService: ProjectService,
    private caseStudyService: CaseStudyService
  ) {}
  ngOnInit(): void {
    this.caseStudyService.getSections().subscribe((result) => {
      this.sectionsName = result.sections;
      this.sectionsNameAvailable = result.sections;
    });

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
        this.users,
        this.insigths,
        this.sections,
        this.pictures
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
          name:null,
          url: null,
          description: null,
          file: null,
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
        if (mode === 'create') {
          this.users.push(result);
        } else {
          var index = this.users.indexOf(user);
          this.users[index] = result;
        }
        this.usersDataSource = new MatTableDataSource(this.users);
      }
    });
  }

  onDeleteUser(user: User) {
    this.users = this.users.filter((result) => result.name !== user.name);
    this.usersDataSource = new MatTableDataSource(this.users);
  }

  openInsightDialog(insight: Insight): void {
    var mode = 'update';

    if (!insight) {
      mode = 'create';
      insight = {
        title: null,
        content: null,
        icon: null,
      };
    }

    const dialogRef = this.dialog.open(InsightDialog, {
      width: '450px',
      data: {
        title: insight.title,
        content: insight.content,
        icon: insight.icon,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (mode === 'create') {
          this.insigths.push(result);
        } else {
          var index = this.insigths.indexOf(insight);
          this.insigths[index] = result;
        }
        this.insightsDataSource = new MatTableDataSource(this.insigths);
      }
    });
  }

  onDeleteInsight(insight: Insight) {
    this.insigths = this.insigths.filter(
      (result) => result.title !== insight.title
    );
    this.insightsDataSource = new MatTableDataSource(this.insigths);
  }

  openSectionDialog(section: Section): void {
    var mode = 'update';

    if (!section) {
      mode = 'create';
      section = {
        name: this.sectionsNameAvailable[0],
        title: null,
        content: null,
        questions: null,
        list: null,
        pictures: [
          {
            url: null,
            description: null,
          },
        ],
        sections: this.sectionsNameAvailable,
      };
    }

    const dialogRef = this.dialog.open(SectionDialog, {
      width: '450px',
      data: {
        name: section.name,
        title: section.title,
        content: section.content,
        questions: section.questions,
        list: section.list,
        pictures: section.pictures,
        sections: this.sectionsNameAvailable,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (mode === 'create') {
          this.sections.push(result);
          this.sectionsNameAvailable = this.sectionsNameAvailable.filter(
            (section) => section !== result.name
          );
        } else {
          var index = this.sections.indexOf(section);
          this.sections[index] = result;
          this.sectionsNameAvailable = this.sectionsName.filter(
            (name) =>
              !this.sections.map((section) => section.name).includes(name)
          );
        }
        this.sectionsDataSource = new MatTableDataSource(this.sections);
      }
    });
  }

  onDeleteSection(section: Section) {
    this.sections = this.sections.filter(
      (result) => result.title !== section.title
    );
    this.sectionsDataSource = new MatTableDataSource(this.sections);
  }


  openPictureDialog(picture: Picture): void {
    var mode = 'update';

    if (!picture) {
      mode = 'create';
      picture = {
        name: null,
        description: null,
        url: null,
        file:null,
      };
    }

    const dialogRef = this.dialog.open(PictureDialog, {
      width: '450px',
      data: {
        name: picture.name,
        description: picture.description,
        url: picture.url,
        file: picture.file
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

  onDeletePicture(picture: Picture){
    this.pictures = this.pictures.filter(
      (result) => result.name !== picture.name
    );
    this.picturesDataSource = new MatTableDataSource(this.pictures);
  }
}
