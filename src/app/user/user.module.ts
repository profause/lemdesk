import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { UserComponent } from './pages/user/user.component';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class UserModule { }
