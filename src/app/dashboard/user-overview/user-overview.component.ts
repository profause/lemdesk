import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ServiceTicket } from 'src/app/shared/models/service-ticket.interface';
import { User } from 'src/app/shared/models/user.interface';
import { BackendService } from 'src/app/shared/services/backend.service';
import { DataService } from 'src/app/shared/services/data.service';
import { DialogButton, DialogType } from 'src/app/shared/services/dialog.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';

@Component({
  selector: 'app-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.scss']
})
export class UserOverviewComponent implements OnInit {

  public isLoading = false;
  public authUser: User;
  private unSubscriptioNotifier = new Subject();
  public itemCount = 0;

  public serviceTicketList = new Array<ServiceTicket>();
  public serviceTicketList$: Observable<ServiceTicket[]> = new Observable<ServiceTicket[]>();
  public serviceTicketListBehaviour: BehaviorSubject<ServiceTicket[]>;
  
  constructor(private router: Router,
    private activateRoute: ActivatedRoute,
    private backend: BackendService,
    private localAuth: LocalAuthService,
    private appMaterialComponent: AppMaterialDesignModule,
    private dataSource: DataService) {
    this.authUser = localAuth.getAuthUser();
    this.serviceTicketListBehaviour = new BehaviorSubject(this.serviceTicketList);
    this.serviceTicketList$ = this.serviceTicketListBehaviour.asObservable();

  }

  ngOnInit(): void {
    this.getServiceTicketList();
  }

  public getServiceTicketList() {
    this.isLoading = true;
    const initiatedByMe = this.backend.getServiceTicketsInitiatedByMe(this.authUser.id);
    initiatedByMe
      .pipe()
      .subscribe({
        next: (result) => {
          const assignedToMeResponse = result;
          this.serviceTicketList = assignedToMeResponse.data;
          this.serviceTicketListBehaviour.next(this.serviceTicketList);
          this.itemCount = result.meta.totalItems || 0;
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

}
