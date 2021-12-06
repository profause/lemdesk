import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServiceTicketCommentComponent } from './add-service-ticket-comment.component';

describe('AddServiceTicketCommentComponent', () => {
  let component: AddServiceTicketCommentComponent;
  let fixture: ComponentFixture<AddServiceTicketCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddServiceTicketCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddServiceTicketCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
