import { Component, OnInit } from '@angular/core';
import {MapComponent} from "../map/map.component";

@Component({
  selector: 'app-one-tab',
  templateUrl: './one-tab.component.html',
  styleUrls: ['./one-tab.component.css']
})
export class OneTabComponent implements OnInit {
  choices:object;
  years:number[];
  selection:string;
  maxmin:object;
  max:number;
  min:number;
  selectedYear:number;
  descriptor:string;
  info:string;

  oneTabSubmit(){
    let mapcomp = new MapComponent();
    mapcomp.removePreviousMap();
    mapcomp.ngOnInit(this.selection, this.selectedYear);
    this.choices = mapcomp.choices;
    this.maxmin = mapcomp.maxmin;
    //console.log(this.maxmin);
    this.max = mapcomp.getMaxValue(this.selectedYear);
    this.min = mapcomp.getMinValue(this.selectedYear);
    this.years = mapcomp.allYears;
    this.info = mapcomp.info;
    this.descriptor = mapcomp.descriptor;
  }

  constructor() { }

  ngOnInit() {
    this.selection="GINI Index (World Bank Estimate)";
    this.selectedYear=2010;
    let mapcomp = new MapComponent;
    mapcomp.removePreviousMap();
    mapcomp.ngOnInit(this.selection, this.selectedYear);
    this.maxmin = mapcomp.maxmin;
    this.choices = mapcomp.choices;
    this.years = mapcomp.allYears;
    this.max = mapcomp.getMaxValue(this.selectedYear);
    this.min = mapcomp.getMinValue(this.selectedYear);
    this.info = mapcomp.info;
    this.descriptor = mapcomp.descriptor;
  }
}
