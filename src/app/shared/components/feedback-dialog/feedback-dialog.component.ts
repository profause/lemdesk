import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { Feedback } from '../../models/feedback.interface';
import { ServiceTicket } from '../../models/service-ticket.interface';
import { User } from '../../models/user.interface';
import { BackendService } from '../../services/backend.service';
import {
  DialogButton,
  DialogOptions,
  DialogService,
  DialogType,
} from '../../services/dialog.service';
import { LocalAuthService } from '../../services/local-auth.service';

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackDialogComponent implements OnInit {
  public serviceTicket: ServiceTicket;
  public feedback: Feedback;
  public isLoading = false;
  private unSubscriptioNotifier = new Subject();
  public feedbackFormGroup: FormGroup;

  public authUser: User = null;
  constructor(
    public dialogRef: MatDialogRef<FeedbackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogOptions: DialogOptions,
    private dialogService: DialogService,
    private backend: BackendService,
    private appMaterialComponent: AppMaterialDesignModule,
    public localAuth: LocalAuthService
  ) {
    this.authUser = localAuth.getAuthUser();
    this.serviceTicket = dialogOptions.data.serviceTicket || {};
    this.feedback = dialogOptions.data.feedback || {};
    this.feedbackFormGroup = new FormGroup({
      id: new FormControl(this.feedback.id, [Validators.nullValidator]),
      comment: new FormControl(this.feedback?.comment, [
        Validators.required,
        Validators.minLength(5),
      ]),
      resolverId: new FormControl(this.serviceTicket.assignedToId),
      serviceTicketId: new FormControl(this.serviceTicket.id),
      initiatorId: new FormControl(this.serviceTicket.initiatorId),
      responseTime: new FormControl(this.feedback?.responseTime || 3, [
        Validators.required,
      ]),
      satisfaction: new FormControl(this.feedback?.satisfaction || 3, [
        Validators.required,
      ]),
      status: new FormControl('CLOSED'),
      createdBy: new FormControl(),
    });
  }

  ngOnInit(): void {}

  hideDialog(): void {
    this.dialogRef.close();
  }

  public cancel(): void {
    this.dialogService.sendMessage({
      text: 'cancel button clicked',
      button: DialogButton.cancel,
    });
    this.dialogRef.close();
  }

  public save(): void {
    const t = this;
    this.isLoading = true;
    this.appMaterialComponent.showProgressDialog('submitting your feedback..');
    let formData = this.feedbackFormGroup.value;
    console.log('form : ' + JSON.stringify(formData));
    if (this.feedback.id != undefined || null != this.feedback.id) {
      //update
      t.backend
        .updateFeedback(formData)
        .pipe(takeUntil(t.unSubscriptioNotifier))
        .subscribe({
          next: (response) => {
            t.isLoading = false;
            this.appMaterialComponent.hideProgressDialog();
            if (response.code === '000') {
              t.dialogService.sendMessage({
                text: 'ok button clicked',
                button: DialogButton.ok,
                data: {
                  status: formData['status'],
                },
              });
            } else {
              t.appMaterialComponent.showAlertDialog(
                DialogType.error,
                'Update Feedback',
                'Error occurred while updating feedback.'
              );
            }
          },
          error: (err: any) => {
            this.appMaterialComponent.hideProgressDialog();
            console.log('An error occurred:', err.error.message);
            t.isLoading = false;
          },
          complete: () => {
            t.dialogRef.close();
            t.isLoading = false;
            console.log('on complete updatefeedback');
          },
        });
    } else {
      delete formData['id'];
      t.backend
        .addFeedback(formData)
        .pipe(takeUntil(t.unSubscriptioNotifier))
        .subscribe({
          next: (response) => {
            this.appMaterialComponent.hideProgressDialog();
            t.isLoading = false;
            if (response.code === '000') {
              t.dialogService.sendMessage({
                text: 'ok button clicked',
                button: DialogButton.ok,
                data: {
                  status: formData['status'],
                },
              });
            } else {
              t.appMaterialComponent.showAlertDialog(
                DialogType.error,
                'Add Feedback',
                'Error occurred while adding feedback.'
              );
            }
          },
          error: (err: any) => {
            this.appMaterialComponent.hideProgressDialog();
            console.log('An error occurred:', err.error.message);
            t.isLoading = false;
          },
          complete: () => {
            t.dialogRef.close();
            t.isLoading = false;
            console.log('on complete addfeedback');
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next();
    this.unSubscriptioNotifier.complete();
  }
}
