import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { BackendService } from 'src/app/shared/services/backend.service';
import { DataService } from 'src/app/shared/services/data.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private unSubscriptioNotifier = new Subject();
  constructor(private router: Router,
    private backend: BackendService,
    private localAuthService: LocalAuthService,
    private appMaterialComponent: AppMaterialDesignModule,
    public dataSource: DataService) { }

  ngOnInit(): void {

    

  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next();
    this.unSubscriptioNotifier.complete();
  }
}
