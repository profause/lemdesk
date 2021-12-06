import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription, Subject, BehaviorSubject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { ServiceTicketComment } from 'src/app/shared/models/service-ticket-comment.interface';
import { ServiceTicket } from 'src/app/shared/models/service-ticket.interface';
import { User } from 'src/app/shared/models/user.interface';
import { BackendService } from 'src/app/shared/services/backend.service';
import { DataService } from 'src/app/shared/services/data.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';

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
