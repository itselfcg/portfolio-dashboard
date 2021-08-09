import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthData } from '../auth/auth-data.model';
import { AuthService } from '../auth/auth.service';
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
  user: AuthData;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getAuthUser();
  }
}
