import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CaseStudy } from '../_models/case-study.model';

import { environment } from 'src/environments/environment';
import { User } from '../_models/user.model';
import { Insight } from '../_models/insight.model';
import { Section } from '../_models/section.model';
import { Sections } from '../_models/sections.model';
const API_URL = environment.apiUrl + '/cases';

@Injectable({ providedIn: 'root' })
export class CaseStudyService {
  private caseStudy: CaseStudy[] = [];
  private caseUpdated = new Subject<CaseStudy[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getCaseStudyUpdateListener() {
    return this.caseUpdated.asObservable();
  }

  getSections() {
    return this.http.get<{ message: string; sections: string[] }>(
      API_URL + '/sections'
    );
  }

  getAll() {
    this.http
      .get<{ message: string; caseStudy: CaseStudy[] }>(API_URL + '/all')
      .subscribe((result) => {
        this.caseStudy = result.caseStudy;
        this.caseUpdated.next([...this.caseStudy]);
      });
  }

  delete(caseId: string) {
    return this.http.delete(API_URL + '/' + caseId);
  }

  create(
    language: string,
    project: string,
    title: string,
    content: string,
    users: User[],
    insights: Insight[],
    sections: Section[]
  ) {
    var formData = new FormData();
    formData.append('language', language);
    formData.append('project', project);
    formData.append('title', title);
    formData.append('content', content);

    var users2: any[] = [];

    // can be remplaced with a map.
    for (let i = 0; i < users.length; i++) {
      let user = {
        id: i,
        name: users[i].name,
        age: users[i].age,
        story: users[i].story,
        occupation: users[i].occupation,
        pictures: { description: users[i].pictures.description },
      };
      users2.push(user);
      formData.append(
        'user-pic-' + i,
        users[i].file,
        users[i].pictures.description
      );
    }

    var section: any = {};
    for (let i = 0; i < sections.length; i++) {
      section[sections[i].name] = {
        title: sections[i].title,
        content: sections[i].content,
        questions: sections[i].questions,
        list: sections[i].list,
      };
    }

    formData.append('users', JSON.stringify(users2));
    formData.append('insights', JSON.stringify(insights));
    formData.append('sections', JSON.stringify(section));

    console.log('Enviando post');
    this.http
      .post<{ message: string; id: string }>(API_URL, formData)
      .subscribe((res) => {});
  }
}
