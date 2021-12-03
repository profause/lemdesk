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



@NgModule({
  declarations: [
    MaterialProgressDialogComponent,
    ConfirmDialogComponent,
    InputDialogComponent,
  ],
  imports: [
    AppMaterialDesignModule,
    CommonModule
  ],
  entryComponents:[
    MaterialProgressDialogComponent,
    ConfirmDialogComponent,
    InputDialogComponent,
    AppbarComponent
  ],
  providers:[
    BackendService,
    WindowService,
    LocalAuthService,
    DataService,
    FormBuilderService,
  ]
})
export class SharedModule { }
