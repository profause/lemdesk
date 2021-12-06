import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTicketComponent } from './service-ticket.component';

describe('ServiceTicketComponent', () => {
  let component: ServiceTicketComponent;
  let fixture: ComponentFixture<ServiceTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
