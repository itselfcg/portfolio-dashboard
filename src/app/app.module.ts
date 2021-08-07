import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectComponent } from './project/create-edit/project.component';
import { CaseStudyComponent } from './case-study/create-edit/case-study.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AngularMaterialModule } from './angular-material.module';
import { MatIconModule } from '@angular/material/icon';
import { CaseStudyHomeComponent } from './case-study/home/case-study-home.component';
import { ProjectsHomeComponent } from './project/home/projects-home.component';
import { LoginComponent } from './auth/login/login.component';
import { UserComponent } from './user/user.component';
import { FooterComponent } from './footer/footer.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { TranslationComponent } from './translation/create-edit/translation.component';
import { TranslationHomeComponent } from './translation/home/translation-home.component';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { BreadcrumbService } from 'xng-breadcrumb';
import { InsightDialog } from './case-study/dialogs/insights/insights-dialog.component';
import { SectionDialog } from './case-study/dialogs/sections/section-dialog.component';
import { UserDialog } from './case-study/dialogs/user/user-dialog.component';
import { ConfirmationDialog } from './dialogs/confirmation/confirmation-dialog.component';
import { ItemsDialog } from './dialogs/items/items-dialog.component';
import { PictureDialog } from './dialogs/picture/picture-dialog.component';
import { StatusDialog } from './dialogs/status/status-dialog.component';
import { WordDialog } from './dialogs/word/word-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProjectComponent,
    ProjectsHomeComponent,
    CaseStudyComponent,
    CaseStudyHomeComponent,
    TranslationHomeComponent,
    TranslationComponent,
    UserComponent,
    HeaderComponent,
    FooterComponent,
    UserDialog,
    InsightDialog,
    SectionDialog,
    PictureDialog,
    ItemsDialog,
    StatusDialog,
    ConfirmationDialog,
    WordDialog,
  ],
  imports: [
    BreadcrumbModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularMaterialModule,
    NgxCaptchaModule,
  ],
  providers: [
    BreadcrumbService,

    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
