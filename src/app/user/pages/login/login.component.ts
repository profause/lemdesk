import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { BackendService } from 'src/app/shared/services/backend.service';
import { DataService } from 'src/app/shared/services/data.service';
import { DialogType } from 'src/app/shared/services/dialog.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginFormGroup: FormGroup;
  public isLoading = false;
  private observers: Subscription[] = [];
  private unSubscriptioNotifier = new Subject();
  constructor(
    public router: Router,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService,
    private dataSource: DataService
  ) {
    this.loginFormGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  public login() {
    this.isLoading = true;
    let formData = this.loginFormGroup.value;
    let t = this;
    console.log('form : ' + JSON.stringify(formData));
    this.backend
      .login(formData)
      .pipe(takeUntil(this.unSubscriptioNotifier))
      .subscribe({
        next: (res) => {
          t.isLoading = false;
          if (res.code == '000') {
            t.localAuth.setUser(res.data);
            switch (res.data.role) {
              case 'ADMIN':
              case 'SYS_ADMIN':
                t.router.navigate(['/dashboard/admin-overview']);
                break;
              case 'USER':
              case 'STUDENT':
                t.router.navigate(['/dashboard/user-overview']);
                break;
              case 'RESOLVER':
                t.router.navigate(['/dashboard/resolver-overview']);
                break;
              default:
                t.router.navigate(['/dashboard']);
            }
          } else {
            this.appMaterialComponent.showAlertDialog(
              DialogType.error,
              'Login',
              res.message
            );
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next();
    this.unSubscriptioNotifier.complete();
    this.observers.forEach((o) => {
      o.unsubscribe();
    });
  }
}
