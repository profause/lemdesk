import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { ServiceTicket } from 'src/app/shared/models/service-ticket.interface';
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
  constructor(public router: Router,
    private activateRoute: ActivatedRoute,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService,
    private dataSource: DataService) {

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
        initiator:new FormControl(''),
      })
     }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id')
      if (id != undefined) {
        this.getServiceTicket(id);
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
        if(response.code === '000'){
          this.serviceTicket = response.data;
          this.serviceTicketFormGroup = new FormGroup({
            id: new FormControl(this.serviceTicket.id),
            title: new FormControl(this.serviceTicket.title),
            description: new FormControl(this.serviceTicket.description),
            type: new FormControl(this.serviceTicket.type),
            status: new FormControl(this.serviceTicket.status),
            assignedTo: new FormControl(this.serviceTicket.assignedTo),
            date: new FormControl(this.serviceTicket.date),
            category: new FormControl(this.serviceTicket.category),
            impact: new FormControl(this.serviceTicket.impact),
            urgency: new FormControl(this.serviceTicket.urgency),
            attachments: new FormControl(this.serviceTicket.attachments),
            initiator:new FormControl(this.serviceTicket.initiator),
          })
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
