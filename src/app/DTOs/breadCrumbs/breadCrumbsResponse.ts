export interface BreadCrumbsResponse {
  breadCrumbsTitle: string,
  urls: UrlOfBreadCrumbs[]
}

export class UrlOfBreadCrumbs {
  constructor(public name: string, public url: string, public exact: boolean = true) {
  }
}
