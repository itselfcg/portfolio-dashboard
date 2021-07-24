import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseStudyComponent } from './case-study/create-edit/case-study.component';
import { CaseStudyHomeComponent } from './case-study/home/case-study-home.component';
import { HomeComponent } from './home/home.component';
import { ProjectComponent } from './project/project.component';



const routes: Routes = [
  { path: 'project', component: ProjectComponent },
  { path: "project/edit/:projectId", component: ProjectComponent },
  { path: 'projects', component: CaseStudyHomeComponent },
  { path: 'case-studies', component: CaseStudyHomeComponent },
  { path: 'case', component: CaseStudyComponent },
  { path: 'case/edit/:caseId', component: CaseStudyComponent },

  { path: '', component: HomeComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled', // Add options right here
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
