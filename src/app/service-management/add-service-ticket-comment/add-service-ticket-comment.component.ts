import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { ServiceTicketComment } from 'src/app/shared/models/service-ticket-comment.interface';
import { User } from 'src/app/shared/models/user.interface';
import { BackendService } from 'src/app/shared/services/backend.service';
import { DialogOptions, DialogService, DialogButton, DialogType } from 'src/app/shared/services/dialog.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';
import { ServiceTicketComponent } from '../service-ticket/service-ticket.component';

@Component({
  selector: 'app-add-service-ticket-comment',
  templateUrl: './add-service-ticket-comment.component.html',
  styleUrls: ['./add-service-ticket-comment.component.scss']
})
export class AddServiceTicketCommentComponent implements OnInit, OnDestroy {

  public isLoading = false;
  private unSubscriptioNotifier = new Subject();
  public serviceTicketCommentFormGroup: FormGroup;
  public serviceTicketComment: ServiceTicketComment
  public authUser: User;
  constructor(public dialogRef: MatDialogRef<AddServiceTicketCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogOptions: DialogOptions,
    private backend: BackendService,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private dialogService: DialogService,) {

    this.authUser = this.localAuth.getAuthUser();
    this.serviceTicketComment = dialogOptions.data || {};
    this.serviceTicketCommentFormGroup = new FormGroup({
      id: new FormControl(this.serviceTicketComment.id, [Validators.nullValidator]),
      text: new FormControl(this.serviceTicketComment.text, [Validators.required, Validators.minLength(5)]),
      type: new FormControl(this.serviceTicketComment.type, [Validators.required]),
      serviceTicketId: new FormControl(this.serviceTicketComment.serviceTicketId, [Validators.nullValidator]),
      createdBy: new FormControl(this.authUser.fullname, [Validators.required]),
    });
  }
  ngOnInit(): void {
  }


  public cancel(): void {
    this.isLoading = false;
    this.dialogService.sendMessage({ text: 'cancel button clicked', button: DialogButton.cancel });
    this.dialogRef.close();
  }

  public save(): void {
    const t = this;
    this.isLoading = true;
    let formData = this.serviceTicketCommentFormGroup.value;

    if (this.serviceTicketComment.id != undefined || null != this.serviceTicketComment.id) {
      //update
      t.backend.updateServiceTicketComment(formData)
        .pipe(takeUntil(t.unSubscriptioNotifier))
        .subscribe({
          next: (response) => {
            t.isLoading = false
            if (response.code === '000') {
              t.dialogService.sendMessage({
                text: 'ok button clicked',
                button: DialogButton.ok, data: response.data
              });
            } else {
              t.appMaterialComponent.showAlertDialog(DialogType.error, 'Update Service Ticket Comment', 'Error occurred while updating Service Ticket Comment.');
            }
          }, error: (err: any) => {
            console.log('An error occurred:', err.error.message);
            t.isLoading = false
          }, complete: () => {
            t.dialogRef.close();
            t.isLoading = false;
            console.log('on complete updateserviceTicketComment');
          }
        })

    } else {
      delete formData['id'];
      t.backend.addServiceTicketComment(formData)
        .pipe(takeUntil(t.unSubscriptioNotifier))
        .subscribe({
          next: (response) => {
            t.isLoading = false
            if (response.code === '000') {
              t.dialogService.sendMessage({
                text: 'ok button clicked',
                button: DialogButton.ok, data: response.data
              });
            } else {
              t.appMaterialComponent.showAlertDialog(DialogType.error, 'Add Service Ticket Comment', 'Error occurred while adding Service Ticket Comment.');
            }
          }, error: (err: any) => {
            console.log('An error occurred:', err.error.message);
            t.isLoading = false
          }, complete: () => {
            t.dialogRef.close();
            t.isLoading = false;
            console.log('on complete Service Ticket Comment');
          }
        })

    }
  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next()
    this.unSubscriptioNotifier.complete()
  }

}
