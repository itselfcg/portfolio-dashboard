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
  private projectUpdated = new Subject<{
    projects: Project[];
    projectsCout: number;
  }>();

  constructor(private http: HttpClient) {}

  getProjectsUpdateListener() {
    return this.projectUpdated.asObservable();
  }

  getAllPaginator(pageSize: number, currentPage: number) {
    this.http
      .get<{ message: string; projects: Project[]; maxProjects: number }>(
        API_URL + '/all',
        {
          params: { pageSize: pageSize, currentPage: currentPage },
        }
      )
      .pipe(
        map((projectData) => {
          return {
            projects: projectData.projects,
            maxProjects: projectData.maxProjects,
          };
        })
      )
      .subscribe((transformedData) => {
        this.projects = transformedData.projects;
        this.projectUpdated.next({
          projects: [...this.projects],
          projectsCout: transformedData.maxProjects,
        });
      });
  }

  getAll() {
    this.http
      .get<{ message: string; projects: Project[]; maxProjects: number }>(
        API_URL + '/all'
      )
      .pipe(
        map((projectData) => {
          return {
            projects: projectData.projects,
            maxProjects: projectData.maxProjects,
          };
        })
      )
      .subscribe((transformedData) => {
        this.projects = transformedData.projects;
        this.projectUpdated.next({
          projects: [...this.projects],
          projectsCout: transformedData.maxProjects,
        });
      });
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

  delete(postId: string, deleteS3: boolean) {
    return this.http.delete(API_URL + '/' + postId, {
      params: { aws: deleteS3 },
    });
  }

  create(
    language: string,
    creation_date: Date,
    name: string,
    title: string,
    content: string,
    git_url: string,
    preview_url: string,
    details: string,
    active: string,
    labels: string[],
    pictures: Picture[]
  ) {
    let formData = new FormData();
    formData.append('language', language);
    var datestr = new Date(creation_date).toUTCString();
    formData.append('creation_date', datestr);
    formData.append('name', name);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('git_url', git_url);
    formData.append('preview_url', preview_url);
    formData.append('details', details);
    formData.append('active', active);
    formData.append('labels', JSON.stringify(labels));

    var picturesMapped = pictures.map((picture) => ({
      fileName: picture.fileName,
      description: picture.description,
      key: picture.key,
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
    creation_date: Date,
    name: string,
    title: string,
    content: string,
    git_url: string,
    preview_url: string,
    details: string,
    active: string,
    labels: string[],
    pictures: Picture[]
  ) {
    let formData = new FormData();
    formData.append('language', language);
    var datestr = new Date(creation_date).toUTCString();
    formData.append('creation_date', datestr);
    formData.append('name', name);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('git_url', git_url);
    formData.append('preview_url', preview_url);
    formData.append('details', details);
    formData.append('active', active);
    formData.append('labels', JSON.stringify(labels));

    var picturesMapped = pictures.map((picture) => ({
      fileName: picture.fileName,
      description: picture.description,
      key: picture.key,
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
