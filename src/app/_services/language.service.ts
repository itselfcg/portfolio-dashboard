import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Language } from '../_models/language.model';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Word } from '../_models/word.model';
import { TranslationService } from './translation.service';
import { Translation } from '../_models/translation.model';
const API_URL = environment.apiUrl + '/languages';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private language: Language[] = [];
  private languageUpdated = new Subject<Language[]>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private translationService: TranslationService
  ) {}
  getLanguageUpdateListener() {
    return this.languageUpdated.asObservable();
  }

  create(name: string, key: string) {
    const fileName = key + '.json';
    return this.http.post<{ language: Language }>(API_URL, {
      name: name,
      key: key,
      fileName: fileName,
      observe: 'response',
    });
  }

  update(id: string, name: string, key: string, fileName: string) {
    return this.http.put<{ language: Language }>(API_URL + '/' + id, {
      name: name,
      key: key,
      fileName: fileName,
      observe: 'response',
    });
  }

  getAll() {
    return this.http
      .get<{ languages: Language[] }>(API_URL)
      .pipe(
        map((projectData: any) => {
          return projectData.languages;
        })
      )
      .subscribe((languages) => {
        this.language = languages;
        this.languageUpdated.next([...this.language]);
      });
  }

  getByID(id: string) {
    return this.http.get<{ message: string; language: Language }>(
      API_URL + '/' + id
    );
  }

  delete(id: string) {
    return this.http.delete(API_URL + '/' + id, {
      observe: 'response',
    });
  }
}
