import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Project } from '../_models/project.model';

import { environment } from 'src/environments/environment';
const API_URL = environment.apiUrl + '/projects';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private projects: Project[] = [];
  private projectUpdated = new Subject<Project[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getProjectsUpdateListener() {
    return this.projectUpdated.asObservable();
  }

  getAll() {
    this.http
      .get<{ message: string; projects: Project[] }>(API_URL + '/all')
      .subscribe((result) => {
        this.projects = result.projects;
        this.projectUpdated.next([...this.projects]);
      });
  }

  getAllWithoutCaseStudy() {
    return this.http.get<{project: Project[] }>(API_URL, {
      params: { details: "false" },
    });
  }

  getById(id: string) {
    return this.http.get<{project: Project[] }>(API_URL, {
      params: { id: id },
    });
  }

  delete(postId: string) {
    return this.http.delete(API_URL + '/' + postId);
  }

  create(
    language: string,
    name: string,
    title: string,
    content: string,
    git_url: string,
    preview_url: string,
    labels: string,
    picture: File,
    picture_alt: string
  ) {
    let formData = new FormData();
    formData.append('language', language);
    formData.append('name', name);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('git_url', git_url);
    formData.append('preview_url', preview_url);
    formData.append('details', 'false');
    let label = labels.split(' ');
    for (var i = 0; i < label.length; i++) {
      formData.append('labels[]', label[i]);
    }
    formData.append('picture', picture, picture_alt);

    this.http
      .post<{ message: string; id: string }>(API_URL, formData)
      .subscribe(
        (res) => {
          this.router.navigate(['/']);
        }
      );
  }

  update(
    id: string,
    language: string,
    name: string,
    title: string,
    content: string,
    git_url: string,
    preview_url: string,
    labels: string,
    picture: File | string,
    picture_alt: string
  ) {
    let formData: FormData = new FormData();
    let formDataProject: Project;
    let flagFormData = false;
    if (typeof picture === 'object') {
      flagFormData=true;
      formData = new FormData();
      formData.append('language', language);
      formData.append('name', name);
      formData.append('title', title);
      formData.append('content', content);
      formData.append('git_url', git_url);
      formData.append('preview_url', preview_url);
      formData.append('details', 'false');
      let label = labels.split(' ');
      for (var i = 0; i < label.length; i++) {
        formData.append('labels[]', label[i]);
      }
      formData.append('picture', picture, picture_alt);

    } else {
      formDataProject = {
        _id: id,
        language: language,
        name: name,
        title: title,
        content: content,
        labels: labels.split(' '),
        git_url: git_url,
        details: "false",
        preview_url: preview_url,
        picture: { url: picture, description: picture_alt },
      };
    }

    this.http
      .put(API_URL + '/' + id, flagFormData ? formData :  formDataProject)
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }
}
