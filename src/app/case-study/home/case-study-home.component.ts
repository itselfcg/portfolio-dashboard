import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConfirmationDialog } from 'src/app/dialogs/confirmation/confirmation-dialog.component';
import { CaseStudy } from 'src/app/_models/case-study.model';
import { CaseStudyService } from 'src/app/_services/case-study.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'case-study-home-app',
  templateUrl: './case-study-home.component.html',
  styleUrls: ['./case-study-home.component.scss'],
})
export class CaseStudyHomeComponent implements OnInit {
  private caseStudySub: Subscription = new Subscription();

  caseStudies: CaseStudy[] = [];
  isLoading = false;
  caseStudyColumns: any[] = [
    'id',
    'language',
    'project',
    'title',
    'active',
    'actions',
  ];
  constructor(
    public caseStudyService: CaseStudyService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.caseStudyService.getAll();
    this.caseStudySub = this.caseStudyService
      .getCaseStudyUpdateListener()
      .subscribe((caseStudies: CaseStudy[]) => {
        this.caseStudies = caseStudies;
        this.isLoading = false;
      });
  }
  onDeleteCase(caseId: string) {
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
                this.caseStudyService.delete(caseId, deleteFromS3).subscribe(
                  () => {
                    this.caseStudyService.getAll();
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
