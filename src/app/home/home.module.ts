import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from '../user/user.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: HomeComponent,
    data: { breadcrumb: 'Home' },
  },
  {
    path: 'projects',

    loadChildren: () =>
      import(`../project/project.module`).then(
        (module) => module.ProjectModule
      ),
  },

  {
    path: 'case-studies',
    loadChildren: () =>
      import(`../case-study/case-study.module`).then(
        (module) => module.CaseStudyModule
      ),
  },

  {
    path: 'translations',

    loadChildren: () =>
      import(`../translation/translation.module`).then(
        (module) => module.TranslationModule
      ),
  },

  {
    path: 'settings',
    component: UserComponent,
    data: { breadcrumb: 'Settings' },
  },
  { path: '"**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeModule {}
