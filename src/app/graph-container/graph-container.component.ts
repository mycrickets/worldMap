import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../data-service/data.service";

@Component({
  selector: 'app-graph-container',
  templateUrl: './graph-container.component.html',
  styleUrls: ['./graph-container.component.css']
})
export class GraphContainerComponent implements OnInit {

  message:number;
  selectedCountries:string[];

  constructor(private data: DataService) {
  }


  fillRange(bg, ed){
    if (bg > ed){
      let temp = bg;
      bg = ed;
      ed = temp;
    }
    let range = [];
    for(let i = parseInt(bg); i <= parseInt(ed); i++){
      range.push(i);
    }
    return range;
  }

  ngOnInit() {
    this.data.currentMessage.subscribe(selectedNum => this.message = selectedNum);
    this.data.currentCountriesList.subscribe(countries => this.selectedCountries = countries);
  }

}
