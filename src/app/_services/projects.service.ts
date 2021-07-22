import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Project } from '../_models/project.model';

import { environment } from 'src/environments/environment';
import { Picture } from '../_models/picture.model';
const API_URL = environment.apiUrl + '/projects';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private projects: Project[] = [];
  private projectUpdated = new Subject<Project[]>();

  constructor(private http: HttpClient) {}

  getProjectsUpdateListener() {
    return this.projectUpdated.asObservable();
  }

  getAllSubscription() {
    this.http
      .get<{ message: string; projects: Project[] }>(API_URL + '/all')
      .subscribe((result) => {
        this.projects = result.projects;
        this.projectUpdated.next([...this.projects]);
      });
  }

  getAll() {
    return this.http.get<{ message: string; projects: Project[] }>(
      API_URL + '/all'
    );
  }

  getAllWithoutCaseStudy() {
    return this.http.get<{ projects: Project[] }>(API_URL, {
      params: { details: 'false' },
    });
  }

  getById(id: string) {
    return this.http.get<{ projects: Project[] }>(API_URL, {
      params: { id: id },
    });
  }

  getByLanguage(language: string) {
    return this.http.get<{ projects: Project[] }>(API_URL, {
      params: { lang: language },
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
    details:string,
    labels: string[],
    pictures: Picture[]
  ) {
    let formData = new FormData();
    formData.append('language', language);
    formData.append('name', name);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('git_url', git_url);
    formData.append('preview_url', preview_url);
    formData.append('details', details);
    formData.append('labels', JSON.stringify(labels));

    var picturesMapped = pictures.map((picture) => ({
      fileName: picture.fileName,
      description: picture.description,
      key:picture.key,
      url: typeof picture.file === 'object' ? '' : picture.url,
    }));

    formData.append('pictures', JSON.stringify(picturesMapped));
    for (let i = 0; i < pictures.length; i++) {
      if (typeof pictures[i].file === 'object') {
        formData.append(
          'preview-pic-' + i,
          pictures[i].file,
          pictures[i].fileName
        );
      }
    }
    return this.http.post<{ message: string; id: string }>(API_URL, formData, {
      observe: 'response',
    });
  }

  update(
    id: string,
    language: string,
    name: string,
    title: string,
    content: string,
    git_url: string,
    preview_url: string,
    details:string,
    labels: string[],
    pictures: Picture[]
  ) {
    let formData = new FormData();
    formData.append('language', language);
    formData.append('name', name);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('git_url', git_url);
    formData.append('preview_url', preview_url);
    formData.append('details', details);
    formData.append('labels', JSON.stringify(labels));

    var picturesMapped = pictures.map((picture) => ({
      fileName: picture.fileName,
      description: picture.description,
      key:picture.key,
      url: typeof picture.file === 'object' ? '' : picture.url,
    }));

    formData.append('pictures', JSON.stringify(picturesMapped));
    for (let i = 0; i < pictures.length; i++) {
      if (typeof pictures[i].file === 'object') {
        formData.append(
          'preview-pic-' + i,
          pictures[i].file,
          pictures[i].fileName
        );
      }
    }

    return this.http.put<{ message: string; id: string }>(
      API_URL + '/' + id,
      formData,
      {
        observe: 'response',
      }
    );
  }
}
