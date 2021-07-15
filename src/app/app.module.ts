import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectComponent } from './project/project.component';
import { CaseStudyComponent } from './case-study/case-study.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AngularMaterialModule } from './angular-material.module';
import { MatIconModule } from '@angular/material/icon';
import { UserDialog } from './case-study/dialogs/user/user-dialog.component';
import { InsightDialog } from './case-study/dialogs/insights/insights-dialog.component';
import { SectionDialog } from './case-study/dialogs/sections/section-dialog.component';
import { PictureDialog } from './case-study/dialogs/picture/picture-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectComponent,
    CaseStudyComponent,
    HomeComponent,
    HeaderComponent,
    UserDialog,
    InsightDialog,
    SectionDialog,PictureDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AngularMaterialModule,
    MatIconModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
