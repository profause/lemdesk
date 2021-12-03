import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppbarComponent } from './shared/components/appbar/appbar.component';
import { HomeComponent } from './user/pages/home/home.component';
import { LoginComponent } from './user/pages/login/login.component';

const routes: Routes = [
  {
    path: 'home', component: HomeComponent,
  },
  {
    path: 'login', component: LoginComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const AppRoutingComponents = [
  LoginComponent,
  HomeComponent,
];
