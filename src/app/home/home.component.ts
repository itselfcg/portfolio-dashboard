import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CaseStudy } from '../_models/case-study.model';
import { Project } from '../_models/project.model';
import { CaseStudyService } from '../_services/case-study.service';
import { ProjectService } from '../_services/projects.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private projectSub: Subscription = new Subscription();
  private caseStudySub: Subscription = new Subscription();
  projects: Project[] = [];
  caseStudies: CaseStudy[] = [];
  isLoading = false;


  proyectColumns: any[] = [
  'id','language','title','content','labels','git_url','details','preview_url','actions'
  ];

  caseStudyColumns: any[] = [
    'id','language','project','title','content','actions'
    ];

  constructor(
    public projectService: ProjectService,
    public caseStudyService: CaseStudyService
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

    this.caseStudyService.getAll();
    this.caseStudySub = this.caseStudyService
      .getCaseStudyUpdateListener()
      .subscribe((caseStudies: CaseStudy[]) => {
        this.caseStudies = caseStudies;
        this.isLoading = false;
      });
  }

  onDeleteProject(postId: string) {
    this.projectService.delete(postId).subscribe(
      () => {
        this.projectService.getAllSubscription();
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onDeleteCase(caseId: string) {
    this.caseStudyService.delete(caseId).subscribe(
      () => {
        this.caseStudyService.getAll();
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}
