import { Component, OnInit } from '@angular/core';
import { MapComponent } from "../map/map.component";

@Component({
  selector: 'app-ratio-tab',
  templateUrl: './ratio-tab.component.html',
  styleUrls: ['./ratio-tab.component.css']
})
export class RatioTabComponent implements OnInit {
  choices:object;
  years:number[];
  selectedData:string;
  yearBeg:number;
  yearEnd:number;
  max:number;
  min:number;
  descriptor:string;


  ratioTabSubmit(){
    let mapcomp = new MapComponent;
    mapcomp.removePreviousMap();
    mapcomp.generateRatioMap(this.yearBeg, this.yearEnd, this.selectedData);
    this.choices = mapcomp.choices;
    this.years = mapcomp.allYears;
    this.descriptor = mapcomp.descriptor;
  }

  constructor() { }

  ngOnInit() {
    let mapcomp = new MapComponent;
    this.selectedData = "Compulsory Education Duration";
    this.yearBeg = 2010;
    this.yearEnd = 2011;
    this.years = mapcomp.allYears;
    this.choices = mapcomp.choices;
    this.descriptor = mapcomp.descriptor
  }

}
