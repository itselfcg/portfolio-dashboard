import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfirmationDialog } from 'src/app/dialogs/confirmation/confirmation-dialog.component';
import { Project } from '../../_models/project.model';
import { ProjectService } from '../../_services/projects.service';

import { MatChipInputEvent } from '@angular/material/chips';
import { MatSelectChange } from '@angular/material/select';
import { Sort } from '@angular/material/sort';
import { RoleAuthService } from 'src/app/_services/role-auth.service';

@Component({
  selector: 'projects-home-app',
  templateUrl: './projects-home.component.html',
  styleUrls: ['./projects-home.component.scss'],
})
export class ProjectsHomeComponent implements OnInit {
  private projectSub: Subscription = new Subscription();
  projects: Project[] = [];
  projectsDataSource = new MatTableDataSource(this.projects);

  isLoading = false;
  projectColumns: any[] = [
    'id',
    'creation',
    'language',
    'title',
    'labels',
    'git_url',
    'details',
    'preview_url',
    'active',
    'actions',
  ];

  //PAGINATION
  totalProjects = 0;
  projectsPerPage = 10;
  pageSizeOptions: number[] = [1, 5, 10, 25, 50];

  //FILTERS
  // LABEL CHIPS
  filterLabels: string[] = [];
  filterLabelsSelected: string[] = [];

  // DROPLIST
  filterOptionsLanguage: string[] = ['All', 'en', 'sp'];
  filterOptions: string[] = ['All', 'Yes', 'No'];
  languageSelected = this.filterOptions[0];
  activeSelected = this.filterOptions[0];
  gitUrlSelected = this.filterOptions[0];
  previewUrlSelected = this.filterOptions[0];
  detailsSelected = this.filterOptions[0];

  filterOptionsSelected = {
    language: this.languageSelected,
    git_url: this.gitUrlSelected,
    preview_url: this.previewUrlSelected,
    details: this.detailsSelected,
    active: this.activeSelected,
  };
  private paginator: MatPaginator;
  sortedProjects: Project[];

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.projectsDataSource.paginator = this.paginator;
  }
  constructor(
    public projectService: ProjectService,
    public dialog: MatDialog,
    private readonly auth: RoleAuthService
  ) {
    this.sortedProjects = this.projects.slice();
  }

  ngAfterViewInit() {
    this.projectsDataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.projectService.getAll();
    this.projectSub = this.projectService
      .getProjectsUpdateListener()
      .subscribe((data: any) => {
        this.projects = data.projects;

        for (let i = 0; i < this.projects.length; i++) {
          for (let j = 0; j < this.projects[i].labels.length; j++) {
            if (
              !this.filterLabels.includes(this.projects[i].labels[j].trim())
            ) {
              this.filterLabels.push(this.projects[i].labels[j].trim());
            }
          }
        }
        this.refreshDataSource();
        this.isLoading = false;
        this.totalProjects = data.projectsCout;
      });
  }

  onChipSelect($event: any, category: any): void {
    category.value = category.value.trim();
    category.selected = $event.selected;
    let index = this.filterLabelsSelected.indexOf(category.value);

    if (category.selected) {
      if (index === -1) {
        this.filterLabelsSelected.push(category.value);
      }
    } else {
      if (index > -1) {
        this.filterLabelsSelected.splice(index, 1);
      }
    }
    this.filterLabels = [...this.filterLabels];
    this.filterDataSource();
  }

  onFilterSelect(eventValue: any) {
    if (eventValue) {
      const filter = eventValue.split('-');
      const value =
        filter[0] === 'Yes' ? 'true' : filter[0] === 'No' ? 'false' : 'All';
      switch (filter[1]) {
        case 'active':
          this.filterOptionsSelected.active = value;
          break;
        case 'details':
          this.filterOptionsSelected.details = value;
          break;
        case 'preview_url':
          this.filterOptionsSelected.preview_url = value;
          break;
        case 'language':
          this.filterOptionsSelected.language = filter[0];
          break;
        case 'git_url':
          this.filterOptionsSelected.git_url = value;
          break;
      }
    }

    this.filterDataSource();
  }

  filterDataSource() {
    var projectsFiltered = [...this.projects];
    const filtered = projectsFiltered.filter((project) =>
      project.labels.some((label) =>
        this.filterLabelsSelected.includes(label.trim())
      )
    );
    if (filtered.length > 0) {
      projectsFiltered = filtered;
    }

    for (const [k, v] of Object.entries(this.filterOptionsSelected)) {
      let option = v;
      let key: keyof Project =
        k === 'active'
          ? 'active'
          : k === 'language'
          ? 'language'
          : k === 'git_url'
          ? 'git_url'
          : k === 'preview_url'
          ? 'preview_url'
          : 'details';

      if (option !== 'All') {
        projectsFiltered = projectsFiltered.filter((project) => {
          if (project[key] === 'true' || project[key] === 'false') {
            return project[key] === option;
          }
          if (
            (option === 'true' && project[key]) ||
            (option === 'false' && !project[key])
          ) {
            return true;
          }
          if (option === 'en' || option === 'sp') {
            return project[key] === option;
          }

          return false;
        });
      }
    }

    this.projectsDataSource = new MatTableDataSource(projectsFiltered);
    if (this.projectsDataSource.paginator) {
      this.projectsDataSource.paginator.firstPage();
    }
  }

  refreshDataSource() {
    this.projectsDataSource = new MatTableDataSource(this.projects);
    this.projectsDataSource.paginator = this.paginator;
  }

  isLabelSelected(value: string) {
    return this.filterLabelsSelected.indexOf(value.trim()) > -1 ? true : false;
  }

  sortData(sort: Sort) {
    const data = this.projects.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedProjects = data;
      return;
    }
    this.sortedProjects = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      let aDate = new Date(a.creation_date).toUTCString();
      let bDate = new Date(b.creation_date).toUTCString();
      switch (sort.active) {
        case 'creation':
          return this.compare(aDate, bDate, isAsc);
        case 'language':
          return this.compare(a.language, b.language, isAsc);
        default:
          return 0;
      }
    });

    this.projects = this.sortedProjects;
    this.refreshDataSource();
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  clearFilters() {
    this.languageSelected = this.filterOptions[0];
    this.activeSelected = this.filterOptions[0];
    this.gitUrlSelected = this.filterOptions[0];
    this.previewUrlSelected = this.filterOptions[0];
    this.detailsSelected = this.filterOptions[0];
    this.filterOptionsSelected = {
      language: this.languageSelected,
      git_url: this.gitUrlSelected,
      preview_url: this.previewUrlSelected,
      details: this.detailsSelected,
      active: this.activeSelected,
    };
    this.filterLabelsSelected = [];

    this.projectsDataSource = new MatTableDataSource(this.projects);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectsDataSource.filter = filterValue.trim().toLowerCase();
  }
  onDeleteProject(postId: string) {
    var message = {
      title: 'Confirmation',
      content: 'Are you sure you want to delete this project?',
      falseOption: '',
      trueOption: 'OK',
    };
    this.dialog
      .open(ConfirmationDialog, {
        data: message,
      })
      .afterClosed()
      .subscribe((confirmation: Boolean) => {
        if (confirmation) {
          message = {
            title: 'AWS',
            content: 'Delete files from S3?',
            falseOption: 'NO',
            trueOption: 'YES',
          };
          this.dialog
            .open(ConfirmationDialog, {
              data: message,
            })
            .afterClosed()
            .subscribe((deleteFromS3: boolean) => {
              if (deleteFromS3 === false || deleteFromS3 === true) {
                this.projectService.delete(postId, deleteFromS3).subscribe(
                  () => {
                    this.projectService.getAll();
                    this.projectSub = this.projectService
                      .getProjectsUpdateListener()
                      .subscribe((data: any) => {
                        this.projects = data.projects;
                        this.refreshDataSource();
                        this.isLoading = false;
                        this.totalProjects = data.projectsCout;
                      });
                  },
                  () => {
                    this.isLoading = false;
                  }
                );
              }
            });
        }
      });
  }
  public get canEdit(): boolean {
    return this.auth.isAdmin();
  }
}
