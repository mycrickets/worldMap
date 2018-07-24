import { Component } from '@angular/core';
import { CompEduDuration } from 'src/assets/CompEduDuration'
import * as d3 from "d3";

declare var require: any;

const _ = require('underscore');
const Datamap = require('datamaps');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  choices: string[];
  eduDurationYearToValue: Map<number,number>;
  eduDurationParsed: Map<string, Map<number,number>>;
  totalEduDuration: Map<string, Map<number,number>>;
  nameToID: Map<string, string>;
  IDToYears: Map<string, Map<number, number>>;

  getMaxValue(year){
    let max = -1000000000;
    let allKeys = this.totalEduDuration.keys();
    for(let i = 0; i < this.totalEduDuration.size; i++){
      let country = allKeys.next();
      if((this.totalEduDuration.get(country.value).get(year)) > max){
        max = this.totalEduDuration.get(country.value).get(year)
      }
    }
    return max
  }

  getMinValue(year){
    let min = 100000000000000000;
    let allKeys = this.totalEduDuration.keys();
    for(let i = 0; i < this.totalEduDuration.size; i++){
      let country = allKeys.next();
      if((this.totalEduDuration.get(country.value).get(year)) < min){
        min = this.totalEduDuration.get(country.value).get(year)
      }
    }
    return min
  }

  static getColorArray(max, min){
    let r = 255;
    let g = 0;
    let b = 0;
    let denom = max-min;
    let colorArray = new Array(denom);
    let chg = Math.floor((510)/denom);
    for(let i = 0; i < denom; i++){
      if(g < 255){
        g += chg;
        colorArray[i] = d3.rgb(r, g, b);
      }
      if(g > 255){
        g -= (g-255)
      }
      if(g == 255) {
        r -= chg;
        if(r < 0){
          r = 0;
        }
        colorArray[i] = d3.rgb(r, g, b);
      }
    }
    return colorArray
  }

  getCountryNames(list){
    let names = Array(this.totalEduDuration.size);
    let ind = this.totalEduDuration.keys();
    for(let i = 0; i < this.totalEduDuration.size; i++){
      let next = ind.next();
      names[i] = next.value;
    }
    return names
  }

  getCountryColor(year, colors){
    let countryToColor = new Map<string, object>();
    let countryKeys = this.IDToYears.keys();
    for(let i = 0; i < this.IDToYears.size; i++){
      let thisyear = countryKeys.next().value;
      let countryScore = this.IDToYears.get(thisyear).get(year);
      let thisColor = colors[countryScore];
      if(countryScore != null){
        countryToColor.set(thisyear, thisColor);
      } else{
        countryToColor.set(thisyear, d3.rgb(0, 0, 0));
      }
    }
    return countryToColor;
  }

  constructor() {
    this.IDToYears = new Map<string, Map<number, number>>();
    this.nameToID = new Map<string, string>();
    this.totalEduDuration = new Map<string, Map<number, number>>();
    this.eduDurationYearToValue = new Map<number, number>();
    this.eduDurationParsed = new Map<string, Map<number, number>>();
    this.choices = ["CompEduDuration", "CompEduStartAge", "GDExpRNDPercGDP", "GDPCapitaCurrent", "GDPCurrent", "GINIWorldBankEstimate"];

    let year = 2012;

    let summation = JSON.parse(CompEduDuration);
    for(let i = 0; i < _.size(summation); i++) {
      let name = summation[i]['Reference Area'];
      let year = summation[i]['Time Period'];
      let value = summation[i]['Observation Value'];
      if (this.eduDurationParsed.get(name) != null){
        this.eduDurationParsed.get(name).set(year, value);
      } else {
        this.eduDurationYearToValue = new Map<number, number>();
        this.eduDurationParsed = new Map<string, Map<number, number>>();
        this.eduDurationParsed.set(name, this.eduDurationYearToValue.set(year, value));
      }
      this.totalEduDuration.set(name, this.eduDurationYearToValue)
    }
    let max = this.getMaxValue(year);
    let min = this.getMinValue(year);



    let names = this.getCountryNames(null);
    let countries = Datamap.prototype.worldTopo.objects.world.geometries;
    for(let i = 0; i < names.length; i++){
      for(let j = 0;j < _.size(countries); j++){
        if(names[i] == countries[j].properties.name){
          this.nameToID.set(names[i], countries[j].id);
        }
      }
    }

    let durationIDS = this.totalEduDuration.entries();
    for(let i = 0; i < this.totalEduDuration.size; i++){
      let nameIDS = this.nameToID.entries();
      let thisduration = durationIDS.next();
      for(let j = 0; j < this.nameToID.size; j++){
        let thisname = nameIDS.next();
        if(thisname.value[0] == thisduration.value[0]){
          this.IDToYears.set(thisname.value[1], thisduration.value[1])
        }
      }
    }
    let colorArray = AppComponent.getColorArray(max, min);
    let countryColor = this.getCountryColor(year, colorArray);
    let dataset = {};
    let countryIDS = countryColor.keys();
    for(let i = 0; i < countryColor.size; i++){
      let thisID = countryIDS.next().value;
      dataset[thisID] = { scoreGiven: this.IDToYears.get(thisID).get(year), fillColor: countryColor.get(thisID) };
    }
    let map = new Datamap({
        element: document.getElementById('container1'),
        height: 900,
        projection: 'mercator',
        fills: {defaultFill: d3.rgb(0, 0, 0)},
        data: dataset,
        geographyConfig: {
          borderColor: '#DEDEDE',
          highlightBorderWidth: 2,
          // don't change color on mouse hover
          highlightFillColor: function (geo) {
            return geo['fillColor'] || '#F5F5F5';
          },
          // only change border
          highlightBorderColor: '#B7B7B7',
          // show desired information in tooltip
          popupTemplate: function (geo, data) {
            // don't show tooltip if country don't present in dataset
            if (!data) {
              return;
            }
            // tooltip content
            return ['<div class="hoverinfo">',
              '<strong>', geo.properties.name, '</strong>',
              '<br>Count: <strong>', data.scoreGiven, '</strong>',
              '</div>'].join('');
          }
        },
      });
  }

}
