import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

declare function account(): any;

@Component({
  selector: 'app-account-side-bar',
  templateUrl: './account-side-bar.component.html',
  styleUrls: ['./account-side-bar.component.scss']
})

export class AccountSideBarComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    account();
  }
}
