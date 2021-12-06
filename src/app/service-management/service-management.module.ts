import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceTicketComponent } from './service-ticket/service-ticket.component';
import { AddServiceTicketComponent } from './add-service-ticket/add-service-ticket.component';
import { ServiceManagementComponent } from './service-management/service-management.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AdminOverviewComponent } from '../dashboard/admin-overview/admin-overview.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ResolverOverviewComponent } from '../dashboard/resolver-overview/resolver-overview.component';

const routes: Routes = [
  {
    path: "service-management",
    component: ServiceManagementComponent, canActivate: [],
    data: {roles: ['ADMIN','RESOLVER']} ,children: [
      {
        path: "request-service",
        component: AddServiceTicketComponent,
      },
      {
        path: "report-issue",
        component: AddServiceTicketComponent,
      },
      {
        path: "request-service/:id",
        component: AddServiceTicketComponent,
      },
      {
        path: "report-issue/:id",
        component: AddServiceTicketComponent,
      },
      {
        path: "requests",
        component: ServiceTicketComponent,
      },

      { path: "**", redirectTo: "requests" },
    ]
  }
];

@NgModule({
  declarations: [

  ],
  imports: [
    SharedModule,
    [RouterModule.forChild(routes)],
    CommonModule
  ]
})
export class ServiceManagementModule { }
export const ServiceManagementRoutingComponents = [
  ServiceTicketComponent,
  AddServiceTicketComponent,
  ServiceManagementComponent
]
