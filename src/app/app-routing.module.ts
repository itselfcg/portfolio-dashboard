import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoggedGuard } from './auth/logged.guard';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { animationState: 'one' },
    canActivate: [LoggedGuard],
  },
  {
    path: '',
    canActivate: [AuthGuard],
    data: { animationState: 'two' },
    loadChildren: () =>
      import(`./home/home.module`).then((module) => module.HomeModule),
  },
  { path: '**', component: LoginComponent, canActivate: [LoggedGuard] },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled', // Add options right here
    }),
  ],
  exports: [RouterModule],
  providers: [AuthGuard, LoggedGuard],
})
export class AppRoutingModule {}
