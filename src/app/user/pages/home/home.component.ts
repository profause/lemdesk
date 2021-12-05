import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { Subscription, Subject } from 'rxjs';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { BackendService } from 'src/app/shared/services/backend.service';
import { DataService } from 'src/app/shared/services/data.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit,OnDestroy {

  public contactUsFormGroup: FormGroup;
  public isLoading = false;
  private observers: Subscription[] = []
  private unSubscriptioNotifier = new Subject();
  constructor(public router: Router,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService,
    private dataSource: DataService) {

      this.contactUsFormGroup = new FormGroup({
        name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required]),
        comment: new FormControl('', [Validators.required])
      });
     }

  ngOnInit(): void {
  }

  public serviceRequest: AnimationOptions = {
    path: '/assets/animations/service_request.anim.json',
  };

  public issueResolution: AnimationOptions = {
    path: '/assets/animations/issue_resolution.anim.json',
  };

  public timelyResponse: AnimationOptions = {
    path: '/assets/animations/timely_response.anim.json',
  };


 public animationCreated(animationItem: AnimationItem): void {
    //console.log(animationItem);
  }

  public sendComment() {

  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next()
    this.unSubscriptioNotifier.complete()
    this.observers.forEach(o => {
      o.unsubscribe()
    })
  }
}
