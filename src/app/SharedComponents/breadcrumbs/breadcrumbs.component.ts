import {Component, Input, OnInit} from '@angular/core';
import {BreadCrumbsResponse} from "../../DTOs/breadCrumbs/breadCrumbsResponse";

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {

  @Input('parentData') public data!: BreadCrumbsResponse;

  constructor() {
  }

  ngOnInit(): void {
  }
}
