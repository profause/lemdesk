import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServiceTicketComponent } from './add-service-ticket.component';

describe('AddServiceTicketComponent', () => {
  let component: AddServiceTicketComponent;
  let fixture: ComponentFixture<AddServiceTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddServiceTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddServiceTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
