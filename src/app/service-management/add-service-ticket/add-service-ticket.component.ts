import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Subscription, Subject, BehaviorSubject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { Department } from 'src/app/shared/models/department.interface';
import { ServiceTicket } from 'src/app/shared/models/service-ticket.interface';
import { User } from 'src/app/shared/models/user.interface';
import { BackendService } from 'src/app/shared/services/backend.service';
import { DataService } from 'src/app/shared/services/data.service';
import { DialogType } from 'src/app/shared/services/dialog.service';
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

  public departmentList = new Array<Department>();
  public departmentList$: Observable<Department[]> = new Observable<Department[]>();
  public departmentListBehaviour: BehaviorSubject<Department[]>;


  constructor(public router: Router,
    private activateRoute: ActivatedRoute,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService,
    private dataSource: DataService) {

    this.categoryListBehaviour = new BehaviorSubject([])
    this.categoryList$ = this.categoryListBehaviour.asObservable();

    this.departmentListBehaviour = new BehaviorSubject([{}])
    this.departmentList$ = this.departmentListBehaviour.asObservable();

    this.authUser = localAuth.getAuthUser();
    this.serviceTicketFormGroup = new FormGroup({
      id: new FormControl(''),
      title: new FormControl(''),
      description: new FormControl(''),
      richTextDescription: new FormControl(''),
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

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id')
      if (id != undefined) {
        this.getServiceTicket(id);
      } else {
        //this.router.navigate(['requests'])
        this.serviceTicket = { id: null }
      }
    })

    this.getServiceCategoryList();
    this.getDepartmentList();
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
              richTextDescription: new FormControl(this.serviceTicket.richTextDescription),
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
    const t = this;
    let formData = this.serviceTicketFormGroup.value;
    console.log(formData);
    if (this.serviceTicket.id != undefined || null != this.serviceTicket.id) {
      //update
      t.backend.updateServiceTicket(formData)
        .pipe(takeUntil(t.unSubscriptioNotifier))
        .subscribe({
          next: (response) => {
            t.isLoading = false
            if (response.code === '000') {
              this.dataSource.setData(response.data)
              this.router.navigate(['requests'])
            } else {
              t.appMaterialComponent.showAlertDialog(DialogType.error, 'Update Service Ticket', 'Error occurred while updating Service Ticket.');
            }
          }, error: (err: any) => {
            console.log('An error occurred:', err.error.message);
            t.isLoading = false
          }, complete: () => {
            t.isLoading = false;
            console.log('on complete updateServiceTicket');
          }
        })

    } else {
      t.backend.addServiceTicket(formData)
        .pipe(takeUntil(t.unSubscriptioNotifier))
        .subscribe({
          next: (response) => {
            t.isLoading = false
            if (response.code === '000') {
              this.dataSource.setData(response.data)
              this.router.navigate(['service-management/requests'])
            } else {
              t.appMaterialComponent.showAlertDialog(DialogType.error, 'Add Service Ticket Comment', 'Error occurred while adding Service Ticket Comment.');
            }
          }, error: (err: any) => {
            console.log('An error occurred:', err.error.message);
            t.isLoading = false
          }, complete: () => {
            t.isLoading = false;
            console.log('on complete Service Ticket');
          }
        })

    }
  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next()
    this.unSubscriptioNotifier.complete()
    this.observers.forEach(o => {
      o.unsubscribe()
    })
  }

  public editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '100px',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter description here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    //upload: (file: File) => { }
    //uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'undo',
        'redo',
        'outdent',
        'strikeThrough',
        'subscript',
        'superscript',
        'fontName'
      ],
      [
        'fontSize',
        'textColor',
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };

}
