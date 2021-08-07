import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CaseStudyComponent } from './create-edit/case-study.component';
import { CaseStudyHomeComponent } from './home/case-study-home.component';


const routes: Routes = [
  {
    path: '',
    component: CaseStudyHomeComponent,
    data: { breadcrumb: 'Case study' },
  },
  {
    path: 'new',
    component: CaseStudyComponent,
    data: { breadcrumb: 'New Case study' },
  },
  {
    path: ':caseId',
    component: CaseStudyComponent,
    data: { breadcrumb: 'Edit Case study' },
  },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseStudyModule { }
