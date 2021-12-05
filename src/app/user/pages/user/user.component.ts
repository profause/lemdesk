import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { User } from 'src/app/shared/models/user.interface';
import { BackendService } from 'src/app/shared/services/backend.service';
import { DataService } from 'src/app/shared/services/data.service';
import { DialogButton, DialogType } from 'src/app/shared/services/dialog.service';
import { AddUserComponent } from '../add-user/add-user.component';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public authUser: User;
  private unSubscriptioNotifier = new Subject();
  public isLoading = false;
  public searchInput: FormControl;

  public userList = new Array<User>();
  public userList$: Observable<User[]> = new Observable<User[]>();
  public userListBehaviour: BehaviorSubject<User[]>;

  constructor(private router: Router,
    private backend: BackendService,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    public dataSource: DataService) {
    this.authUser = localAuth.getAuthUser();
    this.searchInput = new FormControl('');

    this.userListBehaviour = new BehaviorSubject([{}])
    this.userList$ = this.userListBehaviour.asObservable();
  }

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList() {
    this.isLoading = true;
    this.backend.getUserList()
      .pipe(takeUntil(this.unSubscriptioNotifier))
      .subscribe({
        next: (response) => {
          this.isLoading = false
          if (response.code == '000') {
            this.userList = response.data;
            this.userListBehaviour.next(this.userList);
          }
        }
      })
  }

  public deleteUser(user: User) {
    let t = this;
    this.appMaterialComponent.openDialog(ConfirmDialogComponent, {
      width: '400px',
      title: 'Delete User',
      message: 'Are you sure you want to delete this user?',
    }).pipe(
      switchMap((result: DialogButton) => {
        if (result['button'] === DialogButton.ok) {
          t.isLoading = true;
          t.appMaterialComponent.showProgressDialog('Deleting... please wait');
          return t.backend.deleteUser(user.id)
        }
      }),
      takeUntil(this.unSubscriptioNotifier)
    ).subscribe({
      next: (response) => {
        console.log('response came')
        t.appMaterialComponent.hideProgressDialog();
        t.isLoading = false;
        if (response.code == '000') {
          const index = this.userList.findIndex(x => x.id == user.id);
          console.log('index : ' + index);
          t.userList.splice(index, 1);
          //t.getUserList();
        } else {
          this.appMaterialComponent.showAlertDialog(DialogType.error, 'Delete User', 'Error deleting user');
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

  public openAddUserDialog(user: User) {
    this.appMaterialComponent.openDialog(AddUserComponent, {
      width: '750px',
      title: 'Add User',
      message: 'Add User',
      data: user
    }).pipe(take(1),
    ).subscribe({
      next: (result) => {
        console.log('result', result);
        if (result['button'] == DialogButton.ok) {
          const data = result['data'];
          const index = this.userList.findIndex(x => x.id == user.id);
          console.log('index : ' + index);
          if (index == -1) {
            this.userList.push(data);
          } else {
            this.userList[index] = data;
          }
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next();
    this.unSubscriptioNotifier.complete();
  }

}
