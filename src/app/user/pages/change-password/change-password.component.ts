import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { BackendService } from 'src/app/shared/services/backend.service';
import { DataService } from 'src/app/shared/services/data.service';
import { DialogType } from 'src/app/shared/services/dialog.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

  public changePasswordFormGroup: FormGroup;
  public isLoading = false;
  private observers: Subscription[] = []
  private unSubscriptioNotifier = new Subject();
  constructor(public router: Router,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService,
    private dataSource: DataService) {

    this.changePasswordFormGroup = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required]),
      confirmNewPassword: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
  }

  public changePassword(): void {
    this.isLoading = true;
    const currentPassword = this.changePasswordFormGroup.get('currentPassword').value;
    const newPassword = this.changePasswordFormGroup.get('newPassword').value;
    const confirmNewPassword = this.changePasswordFormGroup.get('confirmNewPassword').value;
    if (newPassword !== confirmNewPassword) {
      this.appMaterialComponent.showAlertDialog(DialogType.error, 'Change Password', 'New password and confirm new password do not match');
      this.isLoading = false;
      return;
    }

    this.backend.changePassword({ currentPassword: currentPassword, newPassword: newPassword })
      .pipe(
        switchMap((response) => {
          this.isLoading = false;
          if (response.code === '000') {
            return this.appMaterialComponent.openDialog(ConfirmDialogComponent, {
              width: '400px',
              title: 'Change Password',
              message: 'Your password has been changed successfully. Please login again.',
            })
          } else {
            return this.appMaterialComponent.showAlertDialog(DialogType.error, 'Change Password', response.message);
          }
        }),
        takeUntil(this.unSubscriptioNotifier)
      )
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.router.navigate(['/login']);
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
