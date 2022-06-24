import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { AppMaterialDesignModule } from '../app-material-design.module';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { Department } from '../shared/models/department.interface';
import { User } from '../shared/models/user.interface';
import { BackendService } from '../shared/services/backend.service';
import { DataService } from '../shared/services/data.service';
import { DialogButton, DialogType } from '../shared/services/dialog.service';
import { LocalAuthService } from '../shared/services/local-auth.service';
import { AddDepartmentComponent } from './add-department/add-department.component';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit, OnDestroy {

  public authUser: User;
  private unSubscriptioNotifier = new Subject();
  public isLoading = false;
  public searchInput: FormControl;

  public departmentList = new Array<Department>();
  public departmentList$: Observable<Department[]> = new Observable<Department[]>();
  public departmentListBehaviour: BehaviorSubject<Department[]>;
  constructor(private router: Router,
    private backend: BackendService,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    public dataSource: DataService) {
    this.authUser = localAuth.getAuthUser();
    this.searchInput = new FormControl('');
    this.departmentListBehaviour = new BehaviorSubject([])
    this.departmentList$ = this.departmentListBehaviour.asObservable();
  }

  ngOnInit(): void {
    this.getDepartmentList();
  }

  public openAddDepartmentDialog(department: Department) {
    this.appMaterialComponent.openDialog(AddDepartmentComponent, {
      width: '550px',
      title: 'Add Department',
      message: 'Add Department',
      data: department
    }).pipe(take(1),
    ).subscribe({
      next: (result) => {
        console.log('result', result);
        if (result['button'] == DialogButton.ok) {
          const data = result['data'];
          const index = this.departmentList.findIndex(x => x.id == department.id);
          console.log('index : ' + index);
          if (index == -1) {
            this.departmentList.push(data);
          } else {
            this.departmentList[index] = data;
          }
          this.departmentListBehaviour.next(this.departmentList);
        }
      }
    })
  }
  public deleteDepartment(department: Department) {
    let t = this;
    this.appMaterialComponent.openDialog(ConfirmDialogComponent, {
      width: '400px',
      title: 'Delete Department',
      message: 'Are you sure you want to delete this department?',
    }).pipe(
      switchMap((result: DialogButton) => {
        if (result['button'] === DialogButton.ok) {
          t.isLoading = true;
          t.appMaterialComponent.showProgressDialog('Deleting... please wait');
          return t.backend.deleteDepartment(department.id)
        }
      }),
      takeUntil(this.unSubscriptioNotifier)
    ).subscribe({
      next: (response) => {
        t.appMaterialComponent.hideProgressDialog();
        t.isLoading = false;
        if (response.code == '000') {
          const index = this.departmentList.findIndex(x => x.id == department.id);
          t.departmentList.splice(index, 1);
          this.departmentListBehaviour.next(this.departmentList);
        } else {
          this.appMaterialComponent.showAlertDialog(DialogType.error, 'Delete Department', 'Error deleting department');
        }
      },
      error: (err: any) => {
        t.isLoading = false;
      },
      complete: () => {
        t.isLoading = false;
      }
    })
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

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next()
    this.unSubscriptioNotifier.complete()
  }
}
