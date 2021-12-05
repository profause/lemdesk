import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { BackendService } from 'src/app/shared/services/backend.service';
import { DataService } from 'src/app/shared/services/data.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public loginFormGroup: FormGroup;
  public isLoading = false;
  private observers: Subscription[] = []
  private unSubscriptioNotifier = new Subject();
  constructor(public router: Router,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService,
    private dataSource: DataService) {

    this.loginFormGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
  }

  public login() {
    this.isLoading = true;
    let formData = this.loginFormGroup.value
    let t = this;

    this.backend.login(formData).
      pipe(takeUntil(this.unSubscriptioNotifier))
      .subscribe({
        next: (res) => {
          t.isLoading = false;
          t.localAuth.setUser(res.data);
          switch (res.data.role) {
            case 'ADMIN':
              t.router.navigate(['/dashboard/admin-overview']);
              break;
            case 'USER':
              t.router.navigate(['/dashboard/user-overview']);
              break;
            case 'RESOLVER':
              t.router.navigate(['/dashboard/resolver-overview']);
              break;
            default:
              t.router.navigate(['/dashboard']);
          }


        }
      })

  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next()
    this.unSubscriptioNotifier.complete()
    this.observers.forEach(o => {
      o.unsubscribe()
    })
  }
}
