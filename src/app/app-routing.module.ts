import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoggedGuard } from './auth/logged.guard';
import { LoginComponent } from './auth/login/login.component';
import { CaseStudyComponent } from './case-study/create-edit/case-study.component';
import { CaseStudyHomeComponent } from './case-study/home/case-study-home.component';
import { HomeComponent } from './home/home.component';
import { ProjectComponent } from './project/create-edit/project.component';
import { ProjectsHomeComponent } from './project/home/projects-home.component';
import { TranslationComponent } from './translation/create-edit/translation.component';
import { TranslationHomeComponent } from './translation/home/translation-home.component';
import { UserComponent } from './user/user.component';



const routes: Routes = [
  { path: 'project', component: ProjectComponent ,canActivate: [AuthGuard] },
  { path: "project/edit/:projectId", component: ProjectComponent,canActivate: [AuthGuard]  },
  { path: 'projects', component: ProjectsHomeComponent,canActivate: [AuthGuard]  },
  { path: 'case-studies', component: CaseStudyHomeComponent,canActivate: [AuthGuard]  },
  { path: 'case', component: CaseStudyComponent,canActivate: [AuthGuard]  },
  { path: 'case/edit/:caseId', component: CaseStudyComponent,canActivate: [AuthGuard]  },
  { path: 'settings', component: UserComponent,
  data: { animationState: 'three' },canActivate: [AuthGuard]  },
  { path: 'translations', component: TranslationHomeComponent,canActivate: [AuthGuard]  },
  { path: 'translation', component: TranslationComponent,canActivate: [AuthGuard]  },
  { path: 'translation/edit/:languageID', component: TranslationComponent,canActivate: [AuthGuard]  },

  { path: '', component: HomeComponent,
  data: { animationState: 'two' },canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent,
  data: { animationState: 'one' },canActivate: [LoggedGuard] }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled', // Add options right here
  })],
  exports: [RouterModule],
  providers: [AuthGuard,LoggedGuard]
})
export class AppRoutingModule { }
