import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SwiperConfigInterface, SwiperDirective, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { Observable, BehaviorSubject, Subject, forkJoin } from 'rxjs';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { ServiceTicket } from 'src/app/shared/models/service-ticket.interface';
import { User } from 'src/app/shared/models/user.interface';
import { BackendService } from 'src/app/shared/services/backend.service';
import { DataService } from 'src/app/shared/services/data.service';
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
    
    forkJoin([ticketAssignedToMe,ticketRecentlyClosed,pendingTickets])
    .pipe()
    .subscribe({
      next: (result) => {
        const assignedToMeResponse = result[0];
        this.serviceTicketList = assignedToMeResponse.data;
        this.serviceTicketListBehaviour.next(this.serviceTicketList);

        const recentlyClosedResponse = result[1];
        this.serviceTicketList = recentlyClosedResponse.data;
        this.serviceTicketRecentlyClosedListBehaviour.next(this.serviceTicketList);

        const pendingTicketsResponse = result[2];
        this.serviceTicketList = pendingTicketsResponse.data;
        this.pendingServiceTicketListBehaviour.next(this.serviceTicketList);

        this.isLoading = false;
      },error: (error) => {
        this.isLoading = false;
        console.log(error);
      },complete: () => {
        this.isLoading = false;
        console.log('complete getServiceTicketList');
      }
    })
  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next();
    this.unSubscriptioNotifier.complete();
  }

}
