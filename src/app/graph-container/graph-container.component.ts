import {Component, OnInit} from '@angular/core';
import {DataService} from "../data-service/data.service";

@Component({
  selector: 'app-graph-container',
  templateUrl: './graph-container.component.html',
  styleUrls: ['./graph-container.component.css']
})
export class GraphContainerComponent implements OnInit {

  message:number;
  selectedCountries:string[];
  isScatter:boolean[];
  isResid:boolean[];
  isOneLSRL:boolean;
  isOneResid:boolean;
  isOneResult:boolean;

  constructor(private data: DataService) {
  }

  isBoolean(input){
    if(input){
      return true;
    }
    return false;
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
    this.data.currentIsResid.subscribe(resid => this.isResid = resid);
    this.data.currentIsScatter.subscribe(scatter => this.isScatter = scatter);
    this.data.currentIsOneLSRL.subscribe(lsrl => this.isOneLSRL = lsrl);
    this.data.currentIsOneResid.subscribe(resid => this.isOneResid = resid);
    this.data.currentIsOneResult.subscribe(result => this.isOneResult = result);
  }
}
