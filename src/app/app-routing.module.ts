import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseStudyComponent } from './case-study/case-study.component';
import { HomeComponent } from './home/home.component';
import { ProjectComponent } from './project/project.component';



const routes: Routes = [
  { path: 'project', component: ProjectComponent },
  { path: "project/edit/:projectId", component: ProjectComponent },
  { path: 'case', component: CaseStudyComponent },
  { path: '', component: HomeComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled', // Add options right here
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
