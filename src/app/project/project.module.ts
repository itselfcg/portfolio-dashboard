import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './create-edit/project.component';
import { ProjectsHomeComponent } from './home/projects-home.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectsHomeComponent,
    data: { breadcrumb: 'Project' },
  },
  {
    path: 'new',
    component: ProjectComponent,
    data: { breadcrumb: 'New project' },
  },
  {
    path: ':projectId',
    component: ProjectComponent,
    data: { breadcrumb: 'Edit project' },
  },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectModule { }
