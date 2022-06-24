import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from './components/input-dialog/input-dialog.component';
import { MaterialProgressDialogComponent } from './components/material-progress-dialog/material-progress-dialog.component';
import { AppMaterialDesignModule } from '../app-material-design.module';
import { BackendService } from './services/backend.service';
import { DataService } from './services/data.service';
import { FormBuilderService } from './services/form-builder.service';
import { LocalAuthService } from './services/local-auth.service';
import { WindowService } from './services/window.service';
import { AppbarComponent } from './components/appbar/appbar.component';
import { MaterialAlertDialogComponent } from './components/material-alert-dialog/material-alert-dialog.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { AlertService } from './services/alert.service';
import { MaterialAlertToasterComponent } from './components/material-alert-toaster/material-alert-toaster.component';
import { AddDepartmentComponent } from '../department/add-department/add-department.component';
import { RelativeTimePipe } from './utils/RelativeTimePipe';
import { FeedbackDialogComponent } from './components/feedback-dialog/feedback-dialog.component';



@NgModule({
  declarations: [
    MaterialProgressDialogComponent,
    MaterialAlertDialogComponent,
    MaterialAlertToasterComponent,
    ConfirmDialogComponent,
    InputDialogComponent,
    AddDepartmentComponent,
    RelativeTimePipe,
    FeedbackDialogComponent
  ],
  imports: [
    AppMaterialDesignModule,
    CommonModule
  ],
  exports:[
    MaterialAlertToasterComponent,
    RelativeTimePipe
  ],
  entryComponents:[
    MaterialProgressDialogComponent,
    MaterialAlertDialogComponent,
    MaterialAlertToasterComponent,
    ConfirmDialogComponent,
    InputDialogComponent,
    FeedbackDialogComponent,
    AppbarComponent
  ],
  providers:[
    BackendService,
    WindowService,
    LocalAuthService,
    DataService,
    FormBuilderService,
    AuthGuard,
    RoleGuard,
    AlertService
  ]
})
export class SharedModule { }
