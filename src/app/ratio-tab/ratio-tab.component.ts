import { Component, OnInit } from '@angular/core';
import { MapComponent } from "../map/map.component";
import {OneTabComponent} from "../one-tab/one-tab.component";

@Component({
  selector: 'app-ratio-tab',
  templateUrl: './ratio-tab.component.html',
  styleUrls: ['./ratio-tab.component.css']
})
export class RatioTabComponent implements OnInit {
  choices:object;
  years:number[];
  selectedData:string;
  info:string;
  yearBeg:number;
  yearEnd:number;
  max:number;
  min:number;
  maxmin:object;
  descriptor:string;
  isRatio: boolean = true;


  ratioTabSubmit(){
    let mapcomp = new MapComponent;
    mapcomp.removePreviousMap();
    mapcomp.ngOnInit(this.selectedData, [this.yearBeg, this.yearEnd], this.isRatio);
    this.choices = mapcomp.choices;
    this.years = mapcomp.allYears;
    this.descriptor = mapcomp.descriptor;
    this.info = mapcomp.info;
    this.maxmin = mapcomp.maxmin;
    this.max = mapcomp.max;
    this.min = mapcomp.min;
  }

  constructor() { }

  ngOnInit() {
    this.selectedData = "Gross Expense on R&D as a Percentage of GDP";
    this.yearBeg = 2000;
    this.yearEnd = 2010;
    let mapcomp = new MapComponent;
    mapcomp.removePreviousMap();
    mapcomp.ngOnInit(this.selectedData, [this.yearBeg, this.yearEnd], true);
    this.years = mapcomp.allYears;
    this.choices = mapcomp.choices;
    this.descriptor = mapcomp.descriptor;
    this.info = mapcomp.info;
    this.maxmin = mapcomp.maxmin;
    this.max = mapcomp.max;
    this.min = mapcomp.min;
    let something = new OneTabComponent();
    something.ngOnInit()
  }
}
