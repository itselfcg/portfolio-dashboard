import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
  'id','language','title','labels','git_url','details','preview_url','active','actions'
  ];

  constructor(
    public projectService: ProjectService,
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
    this.projectService.delete(postId).subscribe(
      () => {
        this.projectService.getAllSubscription();
      },
      () => {
        this.isLoading = false;
      }
    );
  }


}
