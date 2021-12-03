import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { BackendService } from '../../services/backend.service';
import { DataService } from '../../services/data.service';
import { LocalAuthService } from '../../services/local-auth.service';

@Component({
  selector: 'app-bar',
  templateUrl: './appbar.component.html',
  styleUrls: ['./appbar.component.scss']
})
export class AppbarComponent implements OnInit {

  constructor(public router: Router,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService,
    private dataSource: DataService) { }

  ngOnInit(): void {
  }

  public signOut() {
    this.appMaterialComponent.showProgressDialog('Signing out...');
    setTimeout(() => {
      this.localAuth.signOut();
      this.router.navigate(['home'], { queryParams: {}, skipLocationChange: false });
      this.appMaterialComponent.hideProgressDialog();
    }, 800)
  }
}
