import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfirmationDialog } from 'src/app/dialogs/confirmation/confirmation-dialog.component';
import { Project } from '../../_models/project.model';
import { ProjectService } from '../../_services/projects.service';

import { MatChipInputEvent } from '@angular/material/chips';
import { MatSelectChange } from '@angular/material/select';

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
  filterOptions: string[] = ['All', 'Yes', 'No'];
  selectedOption = this.filterOptions[0];

  filterOptionsSelected = {
    language: this.selectedOption,
    git_url: this.selectedOption,
    preview_url: this.selectedOption,
    details: this.selectedOption,
    active: this.selectedOption,
  };

  constructor(
    public projectService: ProjectService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.projectService.getAllSubscription(this.projectsPerPage, 1);
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
    category.selected = $event.selected;
    if (category.selected) {
      this.filterLabelsSelected.push(category.value.trim());
    } else {
      let i = this.filterLabelsSelected.indexOf(category.value.trim());
      this.filterLabelsSelected.splice(i);
    }

    this.filterDataSource();
  }

  onFilterSelect(eventValue: any) {
    if (eventValue) {
      const filter = eventValue.split('-');
      const value =
        filter[0] === 'Yes' ? 'true' : filter[0] === 'No' ? 'false' : 'all';
      switch (filter[1]) {
        case 'active':
          this.filterOptionsSelected.active = value;
          break;
        case 'case':
          this.filterOptionsSelected.details = value;
          break;
        case 'preview':
          this.filterOptionsSelected.preview_url = value;
          break;
        case 'language':
          this.filterOptionsSelected.language = value;
          break;
        case 'git':
          this.filterOptionsSelected.git_url = value;
          break;
      }
    }

    this.filterDataSource();
  }

  filterDataSource() {
    let projectsFiltered = [...this.projects];
    const filtered = projectsFiltered.filter((project) =>
      project.labels.some((label) => this.filterLabelsSelected.includes(label))
    );
    if (filtered.length > 0) {
      projectsFiltered = filtered;
    }

    for (const [k, v] of Object.entries(this.filterOptionsSelected)) {
      let option = v === 'true' ? true : v === 'false' ? false : '';
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
      if (typeof option === 'boolean') {
        projectsFiltered = projectsFiltered.filter(
          (project) => project[key] === option
        );
      }
    }

    this.projectsDataSource = new MatTableDataSource(projectsFiltered);
  }

  refreshDataSource() {
    this.projectsDataSource = new MatTableDataSource(this.projects);
  }

  onChangePage(pageEvent: PageEvent) {
    this.projectService.getAllSubscription(
      pageEvent.pageSize,
      pageEvent.pageIndex + 1
    );
    this.projectSub = this.projectService
      .getProjectsUpdateListener()
      .subscribe((data: any) => {
        this.projects = data.projects;
        this.refreshDataSource();
        this.isLoading = false;
        this.totalProjects = data.projectsCout;
      });
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
                    this.projectService.getAllSubscription(
                      this.projectsPerPage,
                      1
                    );
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
}
