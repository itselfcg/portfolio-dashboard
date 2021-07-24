import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
  caseStudyColumns: any[] = ['id', 'language', 'project', 'title', 'actions'];
  constructor(public caseStudyService: CaseStudyService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.caseStudyService.getAll();
    this.caseStudySub = this.caseStudyService
      .getCaseStudyUpdateListener()
      .subscribe((caseStudies: CaseStudy[]) => {
        this.caseStudies = caseStudies;
        console.log(this.caseStudies);

        this.isLoading = false;
      });
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
