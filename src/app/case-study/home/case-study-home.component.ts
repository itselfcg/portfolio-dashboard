import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfirmationDialog } from 'src/app/dialogs/confirmation/confirmation-dialog.component';
import { CaseStudy } from 'src/app/_models/case-study.model';
import { CaseStudyService } from 'src/app/_services/case-study.service';
import { RoleAuthService } from 'src/app/_services/role-auth.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'case-study-home-app',
  templateUrl: './case-study-home.component.html',
  styleUrls: ['./case-study-home.component.scss'],
})
export class CaseStudyHomeComponent implements OnInit {
  private caseStudySub: Subscription = new Subscription();

  caseStudies: CaseStudy[] = [];
  sortedCaseStudies: CaseStudy[];

  caseStudiesDataSource = new MatTableDataSource(this.caseStudies);

  isLoading = false;
  caseStudyColumns: any[] = [
    'id',
    'creation',
    'language',
    'project',
    'title',
    'active',
    'actions',
  ];
  totalCaseStudies = 0;
  caseStudiesPerPage = 10;
  pageSizeOptions: number[] = [1, 5, 10, 25, 50];

  // DROPLIST
  filterOptionsLanguage: string[] = ['All', 'en', 'sp'];
  filterOptions: string[] = ['All', 'Yes', 'No'];
  languageSelected = this.filterOptions[0];
  activeSelected = this.filterOptions[0];
  filterOptionsSelected = {
    language: this.languageSelected,
    active: this.activeSelected,
  };
  private paginator: MatPaginator;

  constructor(
    public caseStudyService: CaseStudyService,
    public dialog: MatDialog,
    private readonly auth: RoleAuthService
  ) {
    this.sortedCaseStudies = this.caseStudies.slice();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.caseStudiesDataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.caseStudyService.getAll();
    this.caseStudySub = this.caseStudyService
      .getCaseStudyUpdateListener()
      .subscribe((data: any) => {
        this.caseStudies = data.caseStudy;
        this.totalCaseStudies = data.caseStudyTotal;
        this.refreshDataSource();
        this.isLoading = false;
      });
  }

  refreshDataSource() {
    this.caseStudiesDataSource = new MatTableDataSource(this.caseStudies);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.caseStudiesDataSource.filter = filterValue.trim().toLowerCase();
  }

  clearFilters() {
    this.languageSelected = this.filterOptions[0];
    this.activeSelected = this.filterOptions[0];
    this.filterOptionsSelected = {
      language: this.languageSelected,
      active: this.activeSelected,
    };
    this.caseStudiesDataSource = new MatTableDataSource(this.caseStudies);
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
        case 'language':
          this.filterOptionsSelected.language = filter[0];
          break;
      }
    }

    this.filterDataSource();
  }

  sortData(sort: Sort) {
    const data = this.caseStudies.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedCaseStudies = data;
      return;
    }
    this.sortedCaseStudies = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      let aDate = new Date(a.creation_date).toUTCString();
      let bDate = new Date(b.creation_date).toUTCString();
      switch (sort.active) {
        case 'creation':
          return this.compare(aDate, bDate, isAsc);
        default:
          return 0;
      }
    });

    this.caseStudies = this.sortedCaseStudies;
    this.refreshDataSource();
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  filterDataSource() {
    var projectsFiltered = new Promise<CaseStudy[]>((resolve, reject) => {
      var projects = [...this.caseStudies];
      return resolve(projects);
    });

    projectsFiltered
      .then((projectsFiltered) => {
        for (const [k, v] of Object.entries(this.filterOptionsSelected)) {
          let option = v;
          let key: keyof CaseStudy = k === 'active' ? 'active' : 'language';

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
        return projectsFiltered;
      })
      .then((filterList: CaseStudy[]) => {
        this.caseStudiesDataSource = new MatTableDataSource(filterList);
        if (this.caseStudiesDataSource.paginator) {
          this.caseStudiesDataSource.paginator.firstPage();
        }
      });
  }

  onDeleteCase(caseId: string) {
    var message = {
      title: 'Confirmation',
      content: 'Are you sure you want to delete this case study?',
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
                this.caseStudyService.delete(caseId, deleteFromS3).subscribe(
                  () => {
                    this.caseStudyService.getAll();
                    this.caseStudySub = this.caseStudyService
                      .getCaseStudyUpdateListener()
                      .subscribe((data: any) => {
                        this.caseStudies = data.caseStudy;
                        this.totalCaseStudies = data.caseStudyTotal;
                        this.refreshDataSource();
                        this.isLoading = false;
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
