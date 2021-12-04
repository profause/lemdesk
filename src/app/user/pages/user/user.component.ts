import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public isLoading = false;
  public searchInput: FormControl;
  constructor() { 
    this.searchInput = new FormControl('');
  }

  ngOnInit(): void {
  }

}
