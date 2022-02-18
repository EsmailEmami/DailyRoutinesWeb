import { Component, OnInit } from '@angular/core';

declare function heroSliderSection():any;

@Component({
  selector: 'app-home-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    heroSliderSection();
  }

}
