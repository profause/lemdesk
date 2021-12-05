import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resolver-overview',
  templateUrl: './resolver-overview.component.html',
  styleUrls: ['./resolver-overview.component.scss']
})
export class ResolverOverviewComponent implements OnInit {

  public isLoading = false
  constructor() { }

  ngOnInit(): void {
  }

}
