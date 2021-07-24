import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CaseStudy } from '../../_models/case-study.model';
import { Insight } from '../../_models/insight.model';
import { Picture } from '../../_models/picture.model';
import { Project } from '../../_models/project.model';
import { Section } from '../../_models/section.model';
import { User } from '../..//_models/user.model';
import { CaseStudyService } from '../../_services/case-study.service';
import { ProjectService } from '../../_services/projects.service';
import { InsightDialog } from './../dialogs/insights/insights-dialog.component';
import { PictureDialog } from '../../dialogs/picture/picture-dialog.component';
import { SectionDialog } from './../dialogs/sections/section-dialog.component';
import { UserDialog } from './../dialogs/user/user-dialog.component';

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
  tabSelected=0;

  caseId: string;
  caseStudy: CaseStudy;

  projects: Project[];
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
  sectionsColumns: any[] = ['name', 'title', 'content', 'list', 'actions'];

  constructor(
    public dialog: MatDialog,
    private projectService: ProjectService,
    private caseStudyService: CaseStudyService,
    public route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.caseStudyService.getSections().subscribe((result) => {
      this.sectionsName = result.sections;
      this.sectionsNameAvailable = result.sections;
    });

    this.projectService.getByLanguage('en').subscribe((result) => {
      console.log(result.projects);
      this.projects = result.projects;
    });

    this.form = new FormGroup({
      language: new FormControl('en', {
        validators: [Validators.required],
      }),
      project: new FormControl(null, { validators: [Validators.required] }),
      title: new FormControl(null, { validators: [Validators.required] }),
      content: new FormControl(null, { validators: [Validators.required] }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('caseId')) {
        this.mode = 'edit';
        this.caseId = paramMap.get('caseId');
        this.isLoading = true;
        this.caseStudyService.getById(this.caseId).subscribe((postData) => {
          this.isLoading = false;
          this.caseStudy = postData.caseStudy[0];

          this.form.setValue({
            language: this.caseStudy.language,
            project: this.caseStudy.project,
            title: this.caseStudy.title,
            content: this.caseStudy.content,
          });

          this.insigths = this.caseStudy.insights;
          this.users = this.caseStudy.users;
          this.pictures = this.caseStudy.pictures;

          let arrSections = this.caseStudy.sections;
          let resultArray = Object.entries(arrSections).map(function (result) {
            let value = result[1];
            let section: Section = {
              name: result[0],
              title: value.title,
              content: value.content,
              list: value.list,
              pictures: value.pictures,
              sections: value.sections,
            };
            return section;
          });
          this.sections = resultArray;
          this.insightsDataSource = new MatTableDataSource(this.insigths);
          this.usersDataSource = new MatTableDataSource(this.users);
          this.picturesDataSource = new MatTableDataSource(this.pictures);
          this.sectionsDataSource = new MatTableDataSource(this.sections);
        });
      }
    });
  }

  onSaveCaseStudy() {
    this.isLoading = true;
    if (this.form.invalid) {
      this.isLoading = false;
      this.tabSelected=0;
      return;
    }
    if (this.mode === 'create') {
      this.caseStudyService
        .create(
          this.form.value.language,
          this.form.value.project,
          this.form.value.title,
          this.form.value.content,
          this.users,
          this.insigths,
          this.sections,
          this.pictures
        )
        .subscribe((result) => {
          this.isLoading = false;
          if (result.status) {
            this.router.navigate(['/']);
          }
        });
    } else {
      this.caseStudyService
        .update(
          this.caseId,
          this.form.value.language,
          this.form.value.project,
          this.form.value.title,
          this.form.value.content,
          this.users,
          this.insigths,
          this.sections,
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

  openUserDialog(user: User): void {
    var mode = 'update';

    if (!user) {
      mode = 'create';
      user = {
        name: null,
        age: null,
        story: null,
        occupation: null,
        picture: {
          fileName: null,
          description: null,
          url: null,
          file: null,
          key:null
        },
      };
    }

    const dialogRef = this.dialog.open(UserDialog, {
      width: '450px',
      data: {
        name: user.name,
        age: user.age,
        story: user.story,
        occupation: user.occupation,
        picture: {
          fileName: user.picture.fileName,
          description: user.picture.description,
          url: user.picture.url,
          file: user.picture.file,
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
        list: null,
        pictures: null,
        sections: this.sectionsNameAvailable,
      };
    }
    const dialogRef = this.dialog.open(SectionDialog, {
      width: '450px',
      data: {
        name: section.name,
        title: section.title,
        content: section.content,
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
        fileName: null,
        description: null,
        url: null,
        file: null,
        key:null
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

  onLanguageChange(){
    var language=this.form.get('language').value;
    this.projectService.getByLanguage(language).subscribe((result) => {
      this.projects = result.projects;
    });
  }
}
