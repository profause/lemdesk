import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SwiperConfigInterface, SwiperDirective, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { Observable, BehaviorSubject, Subject, forkJoin } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ServiceTicket } from 'src/app/shared/models/service-ticket.interface';
import { User } from 'src/app/shared/models/user.interface';
import { BackendService } from 'src/app/shared/services/backend.service';
import { DataService } from 'src/app/shared/services/data.service';
import { DialogButton, DialogType } from 'src/app/shared/services/dialog.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';

@Component({
  selector: 'app-service-ticket',
  templateUrl: './service-ticket.component.html',
  styleUrls: ['./service-ticket.component.scss']
})
export class ServiceTicketComponent implements OnInit, OnDestroy {

  public isLoading = false;
  public swiperConfig: SwiperConfigInterface = {};
  public authUser: User;
  private unSubscriptioNotifier = new Subject();

  public myTicketCount = 0;
  public closedTicketCount = 0;
  public workActionTicketCount = 0;

  public serviceTicketList = new Array<ServiceTicket>();
  public serviceTicketList$: Observable<ServiceTicket[]> = new Observable<ServiceTicket[]>();
  public serviceTicketListBehaviour: BehaviorSubject<ServiceTicket[]>;

  public serviceTicketRecentlyClosedList$: Observable<ServiceTicket[]> = new Observable<ServiceTicket[]>();
  public serviceTicketRecentlyClosedListBehaviour: BehaviorSubject<ServiceTicket[]>;

  public pendingServiceTicketList$: Observable<ServiceTicket[]> = new Observable<ServiceTicket[]>();
  public pendingServiceTicketListBehaviour: BehaviorSubject<ServiceTicket[]>;

  constructor(private router: Router,
    private activateRoute: ActivatedRoute,
    private backend: BackendService,
    private localAuth: LocalAuthService,
    private appMaterialComponent: AppMaterialDesignModule,
    private dataSource: DataService) {
    this.authUser = localAuth.getAuthUser();
    this.serviceTicketListBehaviour = new BehaviorSubject(this.serviceTicketList);
    this.serviceTicketList$ = this.serviceTicketListBehaviour.asObservable();

    this.serviceTicketRecentlyClosedListBehaviour = new BehaviorSubject(this.serviceTicketList);
    this.serviceTicketRecentlyClosedList$ = this.serviceTicketRecentlyClosedListBehaviour.asObservable();

    this.pendingServiceTicketListBehaviour = new BehaviorSubject(this.serviceTicketList);
    this.pendingServiceTicketList$ = this.pendingServiceTicketListBehaviour.asObservable();
  }

  ngOnInit(): void {
    this.swiperConfig = {
      a11y: true,
      direction: 'horizontal',
      slidesPerView: 1,
      observer: true,
      threshold: 10,
      speed: 500,
      spaceBetween: 30,
      centeredSlides: true,
      grabCursor: true,
      keyboard: false,
      allowTouchMove: true,
      longSwipes: false,
      mousewheel: false,
      scrollbar: false,
      navigation: true,
      pagination: this.pagination,
      roundLengths: true,
    };

    this.getServiceTicketList();
  }

  ngAfterViewInit(): void {
    this.activateRoute.queryParams.subscribe(params => {
      let tab = params.tab || '0';
      this.onNavigationMenuClick(tab)
    });
  }

  @ViewChild(SwiperDirective, { static: false })
  swiperDirectiveRef!: SwiperDirective;

  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true,
    hideOnClick: false,
    dynamicBullets: true,
    type: 'bullets'
  };

  public onNavigationMenuClick(index: number) {
    this.swiperDirectiveRef.setIndex(index);
  }


  public getServiceTicketList() {
    this.isLoading = true;
    const ticketAssignedToMe = this.backend.getServiceTicketsAssignedToMe(this.authUser.id);
    const ticketRecentlyClosed = this.backend.getServiceTicketsRecentlyClosed(this.authUser.id);
    const pendingTickets = this.backend.getPendingServiceTickets(this.authUser.id);

    forkJoin([ticketAssignedToMe, ticketRecentlyClosed, pendingTickets])
      .pipe()
      .subscribe({
        next: (result) => {
          const assignedToMeResponse = result[0];
          this.serviceTicketList = assignedToMeResponse.data;
          this.myTicketCount = assignedToMeResponse.meta?.totalItems || 0;
          this.serviceTicketListBehaviour.next(this.serviceTicketList);

          const recentlyClosedResponse = result[1];
          this.serviceTicketList = recentlyClosedResponse.data;
          this.closedTicketCount = recentlyClosedResponse.meta?.totalItems || 0;
          this.serviceTicketRecentlyClosedListBehaviour.next(this.serviceTicketList);

          const pendingTicketsResponse = result[2];
          this.serviceTicketList = pendingTicketsResponse.data;
          this.workActionTicketCount = pendingTicketsResponse.meta?.totalItems || 0;
          this.pendingServiceTicketListBehaviour.next(this.serviceTicketList);

          this.isLoading = false;
        }, error: (error) => {
          this.isLoading = false;
          console.log(error);
        }, complete: () => {
          this.isLoading = false;
          console.log('complete getServiceTicketList');
        }
      })
  }

  public deleteServiceTicket(serviceTicket: ServiceTicket) {
    let t = this;
    this.appMaterialComponent.openDialog(ConfirmDialogComponent, {
      width: '400px',
      title: 'Delete Service Ticket',
      message: 'Are you sure you want to delete this service ticket?',
    }).pipe(
      switchMap((result: DialogButton) => {
        if (result['button'] === DialogButton.ok) {
          t.isLoading = true;
          t.appMaterialComponent.showProgressDialog('Deleting... please wait');
          return t.backend.deleteServiceTicket(serviceTicket.id)
        }
      }),
      takeUntil(this.unSubscriptioNotifier)
    ).subscribe({
      next: (response) => {
        t.appMaterialComponent.hideProgressDialog();
        t.isLoading = false;
        console.log(response)
        if (response.code == '000') {
          const index = this.serviceTicketList.findIndex(x => x.id == serviceTicket.id);
          t.serviceTicketList.splice(index, 1);
          this.serviceTicketListBehaviour.next(this.serviceTicketList);
        } else {
          this.appMaterialComponent.showAlertDialog(DialogType.error, 'Delete Service Ticket', 'Error deleting Service Ticket');
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

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next();
    this.unSubscriptioNotifier.complete();
  }

}
