import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CaseStudy } from '../_models/case-study.model';

import { environment } from 'src/environments/environment';
const API_URL = environment.apiUrl + '/cases';

@Injectable({ providedIn: 'root' })
export class CaseStudyService {

  private caseStudy: CaseStudy[] = [];
  private caseUpdated = new Subject<CaseStudy[]>();

  constructor(private http: HttpClient, private router: Router) {}


  getCaseStudyUpdateListener() {
    return this.caseUpdated.asObservable();
  }

  getAll() {
    this.http
      .get<{ message: string; caseStudy: CaseStudy[]}>(API_URL + '/all')
      .subscribe((result) => {
        this.caseStudy = result.caseStudy;
        this.caseUpdated.next([...this.caseStudy]);
      });
  }

  delete(caseId: string) {
    return this.http.delete(API_URL + '/' + caseId);
  }
}
