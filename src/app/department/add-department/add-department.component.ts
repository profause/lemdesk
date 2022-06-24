import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { Department } from 'src/app/shared/models/department.interface';
import { BackendService } from 'src/app/shared/services/backend.service';
import {
  DialogButton,
  DialogOptions,
  DialogService,
  DialogType,
} from 'src/app/shared/services/dialog.service';
import { AddUserComponent } from 'src/app/user/pages/add-user/add-user.component';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss'],
})
export class AddDepartmentComponent implements OnInit, OnDestroy {
  public isLoading = false;
  private unSubscriptioNotifier = new Subject();
  public departmentFormGroup: FormGroup;
  public department: Department;
  constructor(
    public dialogRef: MatDialogRef<AddDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogOptions: DialogOptions,
    private backend: BackendService,
    private appMaterialComponent: AppMaterialDesignModule,
    private dialogService: DialogService
  ) {
    this.department = dialogOptions.data || {};
    this.departmentFormGroup = new FormGroup({
      id: new FormControl(this.department.id, [Validators.nullValidator]),
      name: new FormControl(this.department.name, [
        Validators.required,
        Validators.minLength(5),
      ]),
      description: new FormControl(this.department.description, [
        Validators.required,
      ]),
      operations: new FormControl(this.department.operations, [
        Validators.nullValidator,
      ]),
    });
  }

  ngOnInit(): void {}

  public cancel(): void {
    this.isLoading = false;
    this.dialogService.sendMessage({
      text: 'cancel button clicked',
      button: DialogButton.cancel,
    });
    this.dialogRef.close();
  }

  public save(): void {
    const t = this;
    this.isLoading = true;
    let formData = this.departmentFormGroup.value;
    console.log('form : ' + JSON.stringify(formData));
    if (this.department.id != undefined || null != this.department.id) {
      //update
      t.backend
        .updateDepartment(formData)
        .pipe(takeUntil(t.unSubscriptioNotifier))
        .subscribe({
          next: (response) => {
            t.isLoading = false;
            if (response.code === '000') {
              t.dialogService.sendMessage({
                text: 'ok button clicked',
                button: DialogButton.ok,
                data: response.data,
              });
            } else {
              t.appMaterialComponent.showAlertDialog(
                DialogType.error,
                'Update Department',
                'Error occurred while updating department.'
              );
            }
          },
          error: (err: any) => {
            console.log('An error occurred:', err.error.message);
            t.isLoading = false;
          },
          complete: () => {
            t.dialogRef.close();
            t.isLoading = false;
            console.log('on complete updateDepartment');
          },
        });
    } else {
      delete formData['id'];
      t.backend
        .addDepartment(formData)
        .pipe(takeUntil(t.unSubscriptioNotifier))
        .subscribe({
          next: (response) => {
            t.isLoading = false;
            if (response.code === '000') {
              t.dialogService.sendMessage({
                text: 'ok button clicked',
                button: DialogButton.ok,
                data: response.data,
              });
            } else {
              t.appMaterialComponent.showAlertDialog(
                DialogType.error,
                'Add Department',
                'Error occurred while adding department.'
              );
            }
          },
          error: (err: any) => {
            console.log('An error occurred:', err.error.message);
            t.isLoading = false;
          },
          complete: () => {
            t.dialogRef.close();
            t.isLoading = false;
            console.log('on complete addDepartment');
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next();
    this.unSubscriptioNotifier.complete();
  }
}
