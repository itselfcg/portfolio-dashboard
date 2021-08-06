import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Translation } from '../_models/translation.model';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
const API_URL = environment.apiUrl + '/translations';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private translation: Translation[] = [];

  constructor(private http: HttpClient) {}

  create(translation: Translation) {
    return this.http.post(API_URL, translation, {
      observe: 'response',
    });
  }

  update(languageID: string, translation: Translation) {
    return this.http.put(API_URL, translation, {
      observe: 'response',
    });
  }

  getByKey(key: string) {
    return this.http.get< Translation >(
      API_URL + '/' + key
    );
  }

  getSections() {
    return this.http.get<{ message: string; sections: string[] }>(
      API_URL + '/sections'
    );
  }

  delete(key: string) {
    return this.http.delete(API_URL, {
      params: { languageKey: key },
      observe: 'response',
    });
  }
}
