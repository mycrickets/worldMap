import {Component, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-resid-canvas-chart',
  templateUrl: './resid-canvas-chart.component.html',
  styleUrls: ['./resid-canvas-chart.component.css']
})
export class ResidCanvasChartComponent implements OnInit {

  @Input() canvas;
  @ViewChild('id', { static: false }) id:number;

  constructor() { }

  ngOnInit() {
  }

}
