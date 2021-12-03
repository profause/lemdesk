import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent, children: [
      {
        path: "overview",
        component: OverviewComponent,
      },
      { path: "**", redirectTo: "overview" },
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
  OverviewComponent
]
