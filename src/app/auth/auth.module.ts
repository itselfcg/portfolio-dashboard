import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { LoginComponent } from "./login/login.component";
import { AngularMaterialModule } from "../angular-material.module";

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, AngularMaterialModule, FormsModule]
})
export class AuthModule {}
