import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { CaseStudyComponent } from './case-study/create-edit/case-study.component';
import { CaseStudyHomeComponent } from './case-study/home/case-study-home.component';
import { HomeComponent } from './home/home.component';
import { ProjectComponent } from './project/create-edit/project.component';
import { ProjectsHomeComponent } from './project/home/projects-home.component';



const routes: Routes = [
  { path: 'project', component: ProjectComponent ,canActivate: [AuthGuard] },
  { path: "project/edit/:projectId", component: ProjectComponent,canActivate: [AuthGuard]  },
  { path: 'projects', component: ProjectsHomeComponent,canActivate: [AuthGuard]  },
  { path: 'case-studies', component: CaseStudyHomeComponent,canActivate: [AuthGuard]  },
  { path: 'case', component: CaseStudyComponent,canActivate: [AuthGuard]  },
  { path: 'case/edit/:caseId', component: CaseStudyComponent,canActivate: [AuthGuard]  },
  { path: "login", component: LoginComponent },
  { path: '', component: HomeComponent,canActivate: [AuthGuard] }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled', // Add options right here
  })],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
