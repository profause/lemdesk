import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolverOverviewComponent } from './resolver-overview.component';

describe('OverviewComponent', () => {
  let component: ResolverOverviewComponent;
  let fixture: ComponentFixture<ResolverOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResolverOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolverOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
