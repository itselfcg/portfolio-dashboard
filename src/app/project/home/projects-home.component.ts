import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConfirmationDialog } from 'src/app/dialogs/confirmation/confirmation-dialog.component';
import { CaseStudy } from '../../_models/case-study.model';
import { Project } from '../../_models/project.model';
import { CaseStudyService } from '../../_services/case-study.service';
import { ProjectService } from '../../_services/projects.service';

@Component({
  selector: 'projects-home-app',
  templateUrl: './projects-home.component.html',
  styleUrls: ['./projects-home.component.scss'],
})
export class ProjectsHomeComponent implements OnInit {
  private projectSub: Subscription = new Subscription();
  projects: Project[] = [];
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

  constructor(
    public projectService: ProjectService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.projectService.getAllSubscription();
    this.projectSub = this.projectService
      .getProjectsUpdateListener()
      .subscribe((projects: Project[]) => {
        this.projects = projects;
        this.isLoading = false;
      });
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
              if (deleteFromS3===false || deleteFromS3 === true) {
                this.projectService.delete(postId, deleteFromS3).subscribe(
                  () => {
                    this.projectService.getAllSubscription();
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
