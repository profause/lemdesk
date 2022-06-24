import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/app/shared/models/user.interface';
import { BackendService } from 'src/app/shared/services/backend.service';
import { DialogButton, DialogOptions, DialogService, DialogType } from 'src/app/shared/services/dialog.service';
import { takeUntil } from 'rxjs/operators';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { Department } from 'src/app/shared/models/department.interface';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {

  public isLoading = false;
  private unSubscriptioNotifier = new Subject();
  public userFormGroup: FormGroup;
  public user: User

  public departmentList = new Array<Department>();
  public departmentList$: Observable<Department[]> = new Observable<Department[]>();
  public departmentListBehaviour: BehaviorSubject<Department[]>;

  constructor(public dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogOptions: DialogOptions,
    private backend: BackendService,
    private appMaterialComponent: AppMaterialDesignModule,
    private dialogService: DialogService,) {

    this.departmentListBehaviour = new BehaviorSubject([{}])
    this.departmentList$ = this.departmentListBehaviour.asObservable();

    this.user = dialogOptions.data || {};
    this.userFormGroup = new FormGroup({
      id: new FormControl(this.user.id, [Validators.nullValidator]),
      fullname: new FormControl(this.user.fullname, [Validators.required, Validators.minLength(5)]),
      username: new FormControl(this.user.username, [Validators.required]),
      password: new FormControl({ value: '', disabled: this.user.id != undefined }, [Validators.nullValidator]),
      email: new FormControl(this.user.email, [Validators.required, Validators.email]),
      role: new FormControl(this.user.role, [Validators.required]),
      department: new FormControl(this.user.department, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getDepartmentList();
  }

  getDepartmentList() {
    this.isLoading = true;
    this.backend.getDepartmentList()
      .pipe(takeUntil(this.unSubscriptioNotifier))
      .subscribe({
        next: (response) => {
          this.isLoading = false
          if (response.code == '000') {
            this.departmentList = response.data;
            this.departmentListBehaviour.next(this.departmentList);
          }
        }
      })
  }

  public cancel(): void {
    this.isLoading = false;
    this.dialogService.sendMessage({ text: 'cancel button clicked', button: DialogButton.cancel });
    this.dialogRef.close();
  }

  public save(): void {
    const t = this;
    this.isLoading = true;
    let formData = this.userFormGroup.value;

    if (this.user.id != undefined || null != this.user.id) {
      //update
      t.backend.updateUser(formData)
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
              t.appMaterialComponent.showAlertDialog(DialogType.error, 'Update User', 'Error occurred while updating user.');
            }
          }, error: (err: any) => {
            console.log('An error occurred:', err.error.message);
            t.isLoading = false
          }, complete: () => {
            t.dialogRef.close();
            t.isLoading = false;
            console.log('on complete updateUser');
          }
        })

    } else {
      delete formData['id'];
      //bcrypt.hash(formData['password'].trim(), 10, function (err, hash) {
        //formData['password'] = hash
        //console.log(`hash ${hash}`)
        t.backend.addUser(formData)
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
                t.appMaterialComponent.showAlertDialog(DialogType.error, 'Add User', 'Error occurred while adding user.');
              }
            }, error: (err: any) => {
              console.log('An error occurred:', err.error.message);
              t.isLoading = false
            }, complete: () => {
              t.dialogRef.close();
              t.isLoading = false;
              console.log('on complete addUser');
            }
          })
      //})
    }
  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next()
    this.unSubscriptioNotifier.complete()
  }

}
