import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDepartmentComponent } from './department/add-department/add-department.component';
import { DepartmentComponent } from './department/department.component';
import { AppbarComponent } from './shared/components/appbar/appbar.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { RoleGuard } from './shared/guards/role.guard';
import { AddUserComponent } from './user/pages/add-user/add-user.component';
import { ChangePasswordComponent } from './user/pages/change-password/change-password.component';
import { HomeComponent } from './user/pages/home/home.component';
import { LoginComponent } from './user/pages/login/login.component';
import { ResetPasswordComponent } from './user/pages/reset-password/reset-password.component';
import { UserComponent } from './user/pages/user/user.component';

const routes: Routes = [
  {
    path: 'home', component: HomeComponent,
  },
  {
    path: 'login', component: LoginComponent,
  },

  {
    path: 'users', component: UserComponent,canActivate: [AuthGuard,RoleGuard],
    data: {roles: ['ADMIN']}
  },
  {
    path: 'user/change-password', component: ChangePasswordComponent,canActivate: [AuthGuard],
    data: {roles: ['ADMIN']}
  },
  {
    path: 'departments', component: DepartmentComponent,canActivate: [AuthGuard,RoleGuard],
    data: {roles: ['ADMIN']}
  },
  { path: "**", redirectTo: "home" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const AppRoutingComponents = [
  LoginComponent,
  HomeComponent,
  UserComponent,
  AddUserComponent,
  DepartmentComponent,
  AddDepartmentComponent,
  ChangePasswordComponent,
  ResetPasswordComponent
];
