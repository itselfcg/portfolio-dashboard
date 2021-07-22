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
import { Picture } from '../_models/picture.model';
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

  getById(id: string) {
    return this.http.get<{ caseStudy: CaseStudy[] }>(API_URL, {
      params: { id: id },
    });
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
    sections: Section[],
    pictures: Picture[]
  ) {
    var formData = new FormData();
    formData.append('language', language);
    formData.append('project', project);
    formData.append('title', title);
    formData.append('content', content);

    //Generic Pictures

    var picturesMapped = pictures.map((picture) => ({
      fileName: picture.fileName,
      description: picture.description,
    }));

    for (let i = 0; i < pictures.length; i++) {
      formData.append(
        'header-pic-' + i,
        pictures[i].file,
        pictures[i].fileName
      );
    }

    // User Pictures

    var usersMapped = users.map((user) => ({
      name: user.name,
      age: user.age,
      story: user.story,
      occupation: user.occupation,
      picture: {
        fileName: user.picture.fileName,
        description: user.picture.description,
      },
    }));

    for (let i = 0; i < users.length; i++) {
      formData.append(
        'user-pic-' + i,
        users[i].picture.file,
        users[i].picture.fileName
      );
    }

    // Section Pictures
    var section: any = {};
    for (let i = 0; i < sections.length; i++) {
      section[sections[i].name] = {
        title: sections[i].title,
        content: sections[i].content,
        list: sections[i].list,
        pictures: [],
      };

      for (let j = 0; j < sections[i].pictures.length; j++) {
        section[sections[i].name].pictures.push({
          fileName: sections[i].pictures[j].fileName,
          description: sections[i].pictures[j].description,
        });
        formData.append(
          sections[i].name + '-pic-' + i,
          sections[i].pictures[j].file,
          sections[i].pictures[j].fileName
        );
      }
    }

    formData.append('pictures', JSON.stringify(picturesMapped));
    formData.append('users', JSON.stringify(usersMapped));
    formData.append('insights', JSON.stringify(insights));
    formData.append('sections', JSON.stringify(section));

    return this.http.post<{ message: string; id: string }>(API_URL, formData, {
      observe: 'response',
    });
  }

  update(
    id: string,
    language: string,
    project: string,
    title: string,
    content: string,
    users: User[],
    insights: Insight[],
    sections: Section[],
    pictures: Picture[]
  ) {
    var formData = new FormData();
    formData.append('language', language);
    formData.append('project', project);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('insights', JSON.stringify(insights));

    //Generic Pictures
    var picturesMapped = pictures.map((picture) => ({
      fileName: picture.fileName,
      key:picture.key,
      description: picture.description,
      url: typeof picture.file === 'object' ? '' : picture.url,
    }));
    for (let i = 0; i < pictures.length; i++) {
      if (typeof pictures[i].file === 'object') {
        formData.append(
          'header-pic-' + i,
          pictures[i].file,
          pictures[i].fileName
        );
      }
    }

    // User Pictures
    var usersMapped = users.map((user) => ({
      name: user.name,
      age: user.age,
      story: user.story,
      occupation: user.occupation,
      picture: {
        fileName: user.picture.fileName,
        key:user.picture.key,
        description: user.picture.description,
        url: typeof user.picture.file === 'object' ? '' : user.picture.url,
      },
    }));

    for (let i = 0; i < users.length; i++) {
      if (typeof users[i].picture.file === 'object') {
        formData.append(
          'user-pic-' + i,
          users[i].picture.file,
          users[i].picture.fileName
        );
      }
    }

    // Section Pictures

    var sectionsMapped: any = {};
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].title && sections[i].title !== '') {
        sectionsMapped[sections[i].name] = {
          title: sections[i].title ? sections[i].title : '',
          content: sections[i].content ? sections[i].content : '',
          list: sections[i].list ? sections[i].list : '',
          pictures: [], // It's filled in the next loop. needs special logic to append to formData and manage the file (if there's a file)
        };

        if (sections[i].pictures) {
          for (let j = 0; j < sections[i].pictures.length; j++) {
            sectionsMapped[sections[i].name].pictures.push({
              fileName: sections[i].pictures[j].fileName,
              key:sections[i].pictures[j].key,
              description: sections[i].pictures[j].description,
              url:
                typeof sections[i].pictures[j].file === 'object'
                  ? ''
                  : sections[i].pictures[j].url,
            });

            if (typeof sections[i].pictures[j].file === 'object') {
              formData.append(
                sections[i].name + '-pic-' + i,
                sections[i].pictures[j].file,
                sections[i].pictures[j].fileName
              );
            }
          }
        }
      }
    }

    formData.append('pictures', JSON.stringify(picturesMapped));
    formData.append('users', JSON.stringify(usersMapped));
    formData.append('sections', JSON.stringify(sectionsMapped));
    return this.http.put<{ message: string; id: string }>(
      API_URL + '/' + id,
      formData,
      {
        observe: 'response',
      }
    );
  }
}
