import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTicketDetailComponent } from './service-ticket-detail.component';

describe('ServiceTicketDetailComponent', () => {
  let component: ServiceTicketDetailComponent;
  let fixture: ComponentFixture<ServiceTicketDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceTicketDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTicketDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
