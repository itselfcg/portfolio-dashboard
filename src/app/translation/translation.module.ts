import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationComponent } from './create-edit/translation.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslationHomeComponent } from './home/translation-home.component';

const routes: Routes = [
  {
    path: '',
    component: TranslationHomeComponent,
    data: { breadcrumb: 'Translation' },
  },
  {
    path: 'new',
    component: TranslationComponent,
    data: { breadcrumb: 'New translation' },
  },
  {
    path: ':languageID',
    component: TranslationComponent,
    data: { breadcrumb: 'Edit translation' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TranslationModule {}
