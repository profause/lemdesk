import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { BackendService } from '../../services/backend.service';
import { DataService } from '../../services/data.service';
import { LocalAuthService } from '../../services/local-auth.service';

@Component({
  selector: 'app-bar',
  templateUrl: './appbar.component.html',
  styleUrls: ['./appbar.component.scss'],
})
export class AppbarComponent implements OnInit {
  public username: string = '';
  public authUser = null;
  constructor(
    public router: Router,
    private appMaterialComponent: AppMaterialDesignModule,
    public localAuth: LocalAuthService,
    private backend: BackendService,
    private dataSource: DataService
  ) {}

  ngOnInit(): void {
    this.username = this.localAuth.getAuthUser().username;
    this.authUser = this.localAuth.getAuthUser();
  }

  public signOut() {
    this.appMaterialComponent.showProgressDialog('Signing out...');
    setTimeout(() => {
      this.localAuth.signOut();
      this.router.navigate(['home'], {
        queryParams: {},
        skipLocationChange: false,
      });
      this.appMaterialComponent.hideProgressDialog();
    }, 800);
  }

  public navigateToDashboard() {
    switch (this.authUser.role) {
      case 'ADMIN':
      case 'SYS_ADMIN':
        this.router.navigate(['/dashboard/admin-overview']);
        break;
      case 'USER':
      case 'STUDENT':
        this.router.navigate(['/dashboard/user-overview']);
        break;
      case 'RESOLVER':
        this.router.navigate(['/dashboard/resolver-overview']);
        break;
      default:
        this.router.navigate(['/dashboard']);
    }
  }
}
