import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-canvas-chart',
  templateUrl: './canvas-chart.component.html',
  styleUrls: ['./canvas-chart.component.css']
})
export class CanvasChartComponent implements OnInit {

  @Input() canvas;
  @ViewChild('id', { static: false }) id: number;

  constructor() { }

  ngOnInit() {
  }

}
