import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppMaterialDesignModule } from '../app-material-design.module';
import { Department } from '../shared/models/department.interface';
import { User } from '../shared/models/user.interface';
import { BackendService } from '../shared/services/backend.service';
import { DataService } from '../shared/services/data.service';
import { LocalAuthService } from '../shared/services/local-auth.service';

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
    this.departmentListBehaviour = new BehaviorSubject([{}])
    this.departmentList$ = this.departmentListBehaviour.asObservable();
  }

  ngOnInit(): void {
    this.getDepartmentList();
  }

  public openAddDepartmentDialog(department: Department) {
  }
  public deleteDepartment(department: Department) {
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
