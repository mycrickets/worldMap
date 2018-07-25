import { Component, OnInit } from '@angular/core';
import {MapComponent} from "../map/map.component";

@Component({
  selector: 'app-one-tab',
  templateUrl: './one-tab.component.html',
  styleUrls: ['./one-tab.component.css']
})
export class OneTabComponent implements OnInit {
  choices:object;
  selection:string;

  oneTabSubmit(){
    console.log(this.selection);
    let mapcomp = new MapComponent;
    mapcomp.removePreviousMap();
    mapcomp.ngOnInit(this.selection, 2010);
  }

  constructor() { }

  ngOnInit() {
    this.selection="Compulsory Education Duration";
    let mapcomp = new MapComponent;
    mapcomp.removePreviousMap();
    mapcomp.ngOnInit(this.selection, 2010);
    this.choices = mapcomp.choices;
  }
}
