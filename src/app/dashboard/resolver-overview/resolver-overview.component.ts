import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { BackendService } from 'src/app/shared/services/backend.service';
import { DataService } from 'src/app/shared/services/data.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';

@Component({
  selector: 'app-resolver-overview',
  templateUrl: './resolver-overview.component.html',
  styleUrls: ['./resolver-overview.component.scss']
})
export class ResolverOverviewComponent implements OnInit {

  public isLoading = false
  public username:string = '';
  private unSubscriptioNotifier = new Subject();
  constructor(
    public router: Router,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService,
    private dataSource: DataService
  ) { }

  ngOnInit(): void {
    this.username = this.localAuth.getAuthUser().username
  }

}
