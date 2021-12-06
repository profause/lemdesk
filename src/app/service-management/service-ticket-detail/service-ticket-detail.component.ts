import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription, Subject, BehaviorSubject, Observable } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ServiceTicketComment } from 'src/app/shared/models/service-ticket-comment.interface';
import { ServiceTicket } from 'src/app/shared/models/service-ticket.interface';
import { User } from 'src/app/shared/models/user.interface';
import { BackendService } from 'src/app/shared/services/backend.service';
import { DataService } from 'src/app/shared/services/data.service';
import { DialogButton, DialogType } from 'src/app/shared/services/dialog.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';
import { AddServiceTicketCommentComponent } from '../add-service-ticket-comment/add-service-ticket-comment.component';

@Component({
  selector: 'app-service-ticket-detail',
  templateUrl: './service-ticket-detail.component.html',
  styleUrls: ['./service-ticket-detail.component.scss']
})
export class ServiceTicketDetailComponent implements OnInit, OnDestroy {

  public isLoading = false;
  private observers: Subscription[] = []
  private unSubscriptioNotifier = new Subject();
  public serviceTicket: ServiceTicket
  public authUser: User;

  public serviceTicketCommentList = new Array<ServiceTicketComment>();
  public serviceTicketCommentList$: Observable<ServiceTicketComment[]> = new Observable<ServiceTicketComment[]>();
  public serviceTicketCommentListBehaviour: BehaviorSubject<ServiceTicketComment[]>;

  constructor(public router: Router,
    private activateRoute: ActivatedRoute,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService,
    private dataSource: DataService) {

    this.serviceTicketCommentListBehaviour = new BehaviorSubject([])
    this.serviceTicketCommentList$ = this.serviceTicketCommentListBehaviour.asObservable();

  }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id')
      if (id != undefined) {
        this.getServiceTicket(id);
        this.getServiceTicketComments(id);
      } else {
        this.router.navigate(['requests'])
      }
    })

    //this.getServiceCategoryList();
    //this.getDepartmentList();
  }

  public openAddServiceTicketCommentDialog(serviceTicketComment: ServiceTicketComment) {
    this.appMaterialComponent.openDialog(AddServiceTicketCommentComponent, {
      width: '550px',
      title: 'Add Service Ticket Comment',
      message: 'Add Service Ticket Comment',
      data: serviceTicketComment
    }).pipe(take(1),
    ).subscribe({
      next: (result) => {
        console.log('result', result);
        if (result['button'] == DialogButton.ok) {
          const data = result['data'];
          const index = this.serviceTicketCommentList.findIndex(x => x.id == serviceTicketComment.id);
          console.log('index : ' + index);
          if (index == -1) {
            this.serviceTicketCommentList.push(data);
          } else {
            this.serviceTicketCommentList[index] = data;
          }
        }
      }
    })
  }

  public deleteServiceTicketComment(serviceTicketComment: ServiceTicketComment) {
    let t = this;
    this.appMaterialComponent.openDialog(ConfirmDialogComponent, {
      width: '400px',
      title: 'Delete Service Ticket Comment',
      message: 'Are you sure you want to delete this service ticket comment?',
    }).pipe(
      switchMap((result: DialogButton) => {
        if (result['button'] === DialogButton.ok) {
          t.isLoading = true;
          t.appMaterialComponent.showProgressDialog('Deleting... please wait');
          return t.backend.deleteServiceTicketComment(serviceTicketComment.id)
        }
      }),
      takeUntil(this.unSubscriptioNotifier)
    ).subscribe({
      next: (response) => {
        t.appMaterialComponent.hideProgressDialog();
        t.isLoading = false;
        if (response.code == '000') {
          const index = this.serviceTicketCommentList.findIndex(x => x.id == serviceTicketComment.id);
          
          t.serviceTicketCommentList.splice(index, 1);
          //t.getUserList();
        } else {
          this.appMaterialComponent.showAlertDialog(DialogType.error, 'Delete Service Ticket Comment', 'Error deleting Service Ticket Comment');
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


  public getServiceTicket(id: string) {
    this.isLoading = true;
    this.backend.getServiceTicketById(id)
      .pipe(takeUntil(this.unSubscriptioNotifier))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.code === '000') {
            this.serviceTicket = response.data;
          }
        }
      })
  }

  public getServiceTicketComments(id: string) {
    this.isLoading = true;
    this.backend.getServiceTicketComments(id)
      .pipe(takeUntil(this.unSubscriptioNotifier))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.code === '000') {
            this.serviceTicketCommentList = response.data;
            this.serviceTicketCommentListBehaviour.next(this.serviceTicketCommentList);
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
