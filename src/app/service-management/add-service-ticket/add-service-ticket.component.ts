import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription, Subject, BehaviorSubject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { ServiceTicket } from 'src/app/shared/models/service-ticket.interface';
import { User } from 'src/app/shared/models/user.interface';
import { BackendService } from 'src/app/shared/services/backend.service';
import { DataService } from 'src/app/shared/services/data.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';

@Component({
  selector: 'app-add-service-ticket',
  templateUrl: './add-service-ticket.component.html',
  styleUrls: ['./add-service-ticket.component.scss']
})
export class AddServiceTicketComponent implements OnInit, OnDestroy {

  public serviceTicketFormGroup: FormGroup

  public isLoading = false;
  private observers: Subscription[] = []
  private unSubscriptioNotifier = new Subject();
  public serviceTicket: ServiceTicket
  public authUser: User;

  public categoryList = new Array<string>();
  public categoryList$: Observable<string[]> = new Observable<string[]>();
  public categoryListBehaviour: BehaviorSubject<string[]>;


  constructor(public router: Router,
    private activateRoute: ActivatedRoute,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService,
    private dataSource: DataService) {

    this.categoryListBehaviour = new BehaviorSubject([])
    this.categoryList$ = this.categoryListBehaviour.asObservable();


    this.authUser = localAuth.getAuthUser();
    this.serviceTicketFormGroup = new FormGroup({
      id: new FormControl(''),
      title: new FormControl(''),
      description: new FormControl(''),
      type: new FormControl(''),
      status: new FormControl(''),
      assignedTo: new FormControl(''),
      date: new FormControl(''),
      category: new FormControl(''),
      impact: new FormControl(''),
      urgency: new FormControl(''),
      attachments: new FormControl(''),
      initiator: new FormControl(this.authUser.fullname),
    })
  }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id')
      if (id != undefined) {
        this.getServiceTicket(id);
      }
    })

    this.getServiceCategoryList();
  }

  getServiceCategoryList() {
    this.isLoading = true;
    this.backend.getServiceCategoryList()
      .pipe(takeUntil(this.unSubscriptioNotifier))
      .subscribe({
        next: (response) => {
          this.isLoading = false
          if (response.code == '000') {
            this.categoryList = response.data;
            this.categoryListBehaviour.next(this.categoryList);
          }
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
            this.serviceTicketFormGroup = new FormGroup({
              id: new FormControl(this.serviceTicket.id),
              title: new FormControl(this.serviceTicket.title),
              description: new FormControl(this.serviceTicket.description),
              type: new FormControl(this.serviceTicket.type),
              status: new FormControl(this.serviceTicket.status),
              assignedTo: new FormControl(this.serviceTicket.assignedTo['name']),
              date: new FormControl(this.serviceTicket.date),
              category: new FormControl(this.serviceTicket.category),
              impact: new FormControl(this.serviceTicket.impact),
              urgency: new FormControl(this.serviceTicket.urgency),
              attachments: new FormControl(this.serviceTicket.attachments),
              initiator: new FormControl(this.serviceTicket.initiator['name']),
            })
          }
        }
      })
  }

  public submit() {
    this.isLoading = true;
  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next()
    this.unSubscriptioNotifier.complete()
    this.observers.forEach(o => {
      o.unsubscribe()
    })
  }

}
