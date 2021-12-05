import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ResolverOverviewComponent } from './resolver-overview/resolver-overview.component';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { AdminOverviewComponent } from './admin-overview/admin-overview.component';
import { RoleGuard } from '../shared/guards/role.guard';

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent, canActivate: [],
    data: {roles: ['ADMIN']} ,children: [
      {
        path: "resolver-overview",
        component: ResolverOverviewComponent,
      },
      {
        path: "admin-overview",
        component: AdminOverviewComponent,
      },
      { path: "**", redirectTo: "resolver-overview" },
    ]
  }
];

@NgModule({
  declarations: [
  ],
  exports: [RouterModule],
  imports: [
    SharedModule,
    [RouterModule.forChild(routes)],
    CommonModule
  ]
})
export class DashboardModule { }
export const DashboardRoutingComponents = [
  DashboardComponent,
  ResolverOverviewComponent,
  AdminOverviewComponent
]
