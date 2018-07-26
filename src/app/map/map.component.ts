import { Component, OnInit } from '@angular/core';
import {CompEduDuration} from "../../assets/CompEduDuration";
import * as d3 from "d3";

import { CompEduStartAge } from "../../assets/CompEduStartAge";
import { GDExpRNDPercGDP } from "../../assets/GDExpRNDPercGDP";
import { GDPCapitaConst2011 } from "../../assets/GDPCapitaConst2011";
import { GDPCapitaCurrent } from "../../assets/GDPCapitaCurrent";
import { GDPConst2011 } from "../../assets/GDPConst2011";
import { GDPCurrent } from "../../assets/GDPCurrent";
import { GINIWorldBankEstimate } from "../../assets/GINIWorldBankEstimate";
import {time} from "d3";

declare var require: any;

const _ = require('underscore');
const Datamap = require('datamaps');

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  eduDurationYearToValue: Map<number,number>;
  eduDurationParsed: Map<string, Map<number,number>>;
  totalEduDuration: Map<string, Map<number,number>>;
  nameToID: Map<string, string>;
  IDToYears: Map<string, Map<number, number>>;
  year: number;
  parsedData: string;
  title: string;
  choices: object[];
  allYears: number[];
  dataType: string;
  nameType: string;
  yearType: string;
  maxmin: object;
  descriptor: string;

  getMaxValue(year){
    year = parseInt(year);
    let max = -1000000000;
    let allKeys = this.totalEduDuration.keys();
    for(let i = 0; i < this.totalEduDuration.size; i++){
      let country = allKeys.next();
      if((this.totalEduDuration.get(country.value).get(year)) > max){
        max = this.totalEduDuration.get(country.value).get(year);
      }
    }
    return max
  }

  getMinValue(year){
    year = parseInt(year);
    let min = 10000000000000;
    let allKeys = this.totalEduDuration.keys();
    for(let i = 0; i < this.totalEduDuration.size; i++){
      let country = allKeys.next();
      if((this.totalEduDuration.get(country.value).get(year)) < min ){
        min = this.totalEduDuration.get(country.value).get(year);
      }
    }
    return min
  }

  static getColorArray(max, min, something){
    let r = 255;
    let g = 0;
    let b = 0;
    let denom = max-min;
    if(something) {
      let divvy = 15;
      let colorArray = new Array(15);
      let chg = 510/15;
      for(let i = 0; i < divvy; i++){
        if(g < 255){
          g += chg;
          colorArray[i] = d3.rgb(r, Math.floor(g), b);
        }
        if(g > 255){
          g -= (g-255)
        }
        if(g == 255) {
          r -= chg;
          if(r < 0){
            r = 0;
          }
          colorArray[i] = d3.rgb(Math.floor(r), g, b);
        }
      }
      return colorArray
    }
    let colorArray = new Array(denom);
    let chg = (510)/denom;
    for(let i = 0; i < denom; i++){
      if(g < 255){
        g += chg;
        colorArray[i] = d3.rgb(r, Math.floor(g), b);
      }
      if(g > 255){
        g -= (g-255)
      }
      if(g == 255) {
        r -= chg;
        if(r < 0){
          r = 0;
        }
        colorArray[i] = d3.rgb(Math.floor(r), g, b);
      }
    }
    return colorArray
  }

  getCountryNames(){
    let names = Array(this.totalEduDuration.size);
    let ind = this.totalEduDuration.keys();
    for(let i = 0; i < this.totalEduDuration.size; i++){
      let next = ind.next();
      names[i] = next.value;
    }
    return names
  }

  getCountryColor(year, colors){
    let divvy = (this.getMaxValue(year)-this.getMinValue(year));
    let countryToColor = new Map<string, object>();
    let countryKeys = this.IDToYears.keys();
    for(let i = 0; i < this.IDToYears.size; i++){
      let thisyear = countryKeys.next().value;
      let countryScore = this.IDToYears.get(thisyear).get(year);
      let thisColor = colors[(countryScore % divvy) - 1];
      if(countryScore == this.getMaxValue(year)){
        thisColor = colors[divvy-1];
      }
      if(countryScore == this.getMinValue(year)){
        thisColor = colors[0];
      }
      if(countryScore != null){
        countryToColor.set(thisyear, thisColor);
      } else{
        countryToColor.set(thisyear, d3.rgb(0, 0, 0));
      }
    }
    return countryToColor;
  }

  removePreviousMap(){
    document.getElementById('map-container').children.item(0).remove();
    document.getElementById('map-container').children.item(0).remove();
  }

  getAllYears(data, timePeriod){
    let years = [];
    let timeValue;
    if(timePeriod != null){
      timeValue = 'Time Period'
    } else{
      timeValue = 'Year'
    }
    for(let i = 0; i < _.size(data); i++){
      if(!years.includes(data[i][timeValue])){
        years.push(data[i][timeValue]);
      }
    }
    return years.sort();
  }

  getDataForYear(data, year){
    let results = [];
    for(let i = 0; i < _.size(data); i++){
      if(data[i][this.yearType] == parseInt(year)){
        results.push(data[i]);
      }
    }
    return results;
  }

  getMaxMinCountry(data, year){
    let min = this.getMinValue(year);
    let max = this.getMaxValue(year);
    let extremaCountries = {
      'max': [],
      'min': []
    };
    let perc;
    if (data[0]['Units of measurement'] == "Percent") {
      perc = true;
    }
    let dataYear = this.getDataForYear(data, year);
    for(let i = 0; i < _.size(dataYear); i++){
      let dataPointValue = dataYear[i][this.dataType];
      let dataPointName = dataYear[i][this.nameType];
      if (Math.floor(dataPointValue.toString().length) >= 8) {
        dataPointValue /= 10000000
      }
      if(perc){
        dataPointValue = Math.floor(10 * dataPointValue);
      }
      if(dataPointValue == max){
        if(!extremaCountries['max'].includes(dataPointName)) {
          extremaCountries['max'].push(dataPointName);
        }
      }
      if(dataPointValue == min){
        if(!extremaCountries['min'].includes(dataPointName)) {
          extremaCountries['min'].push(dataPointName);
        }
      }
    }
    return extremaCountries
  }

  ngOnInit(selectedData=null, selectedYear=null, ratio=false){

    this.choices = [
      {'name': "Compulsory Education Duration", 'file': CompEduDuration},
      {'name': "Compulsory Education Starting Age", 'file': CompEduStartAge},
      {'name': "Gross Expense on R&D as a Percentage of GDP", 'file': GDExpRNDPercGDP},
      {'name': "GDP Per Capita in 2011 US Dollars", 'file': GDPCapitaConst2011},
      {'name': "GDP Per Capita in Current US Dollars", 'file': GDPCapitaCurrent},
      {'name': "Total GDP in 2011 US Dollars", 'file': GDPConst2011},
      {'name': "Total GDP in Current US Dollars", 'file': GDPCurrent},
      {'name': "GINI Index (World Bank Estimate)", 'file': GINIWorldBankEstimate}
    ];

    this.IDToYears = new Map<string, Map<number, number>>();
    this.nameToID = new Map<string, string>();
    this.totalEduDuration = new Map<string, Map<number, number>>();
    this.eduDurationYearToValue = new Map<number, number>();
    this.eduDurationParsed = new Map<string, Map<number, number>>();
    this.year = parseInt(selectedYear);
    let choice = selectedData;

    let perc;
    let obvsValue;
    let maxColorArray;

    if(choice == null){
      choice = "Compulsory Education Duration";
    }
    if(selectedYear == null){
      this.year = 2010;
    }
    let year = this.year;
    let k = 0;
    for(let i = 0; i < this.choices.length; i++){
      if(this.choices[i]['name'] == choice){
        k = i;
      }
    }
    let summation = JSON.parse(this.choices[k]['file']);
    this.allYears = this.getAllYears(summation, summation[0]['Time Period']);
    this.parsedData = "";
    if (summation[0]['Units of measurement'] == "Percent") {
      perc = true;
    }
    if (summation[0]['Value'] != null) {
      obvsValue = true;
    }
    let GDP = false;
    if(this.choices[k]['name'].includes("Total GDP") /*&& !this.choices[k]['name'].includes("Capita")*/){
      GDP = true
    }
    for (let i = 0; i < _.size(summation); i++) {
      let name = summation[i]['Reference Area'];
      let year = summation[i]['Time Period'];
      let value = summation[i]['Observation Value'];
      if (obvsValue) {
        this.dataType = 'Value';
        this.nameType = 'Country or Area';
        this.yearType = 'Year';
        value = summation[i]['Value'];
        name = summation[i]['Country or Area'];
        year = summation[i]['Year'];
      }
      else {
        this.dataType = 'Observation Value';
        this.nameType = 'Reference Area';
        this.yearType = 'Time Period';
      }
      if(GDP){
        value /= 10000000;
      }
      if (perc) {
        value = Math.floor(10 * value);
      }
      value = Math.floor(value);
      if (this.eduDurationParsed.get(name) != null) {
        this.eduDurationParsed.get(name).set(year, value);
      } else {
        this.eduDurationYearToValue = new Map<number, number>();
        this.eduDurationParsed = new Map<string, Map<number, number>>();
        this.eduDurationParsed.set(name, this.eduDurationYearToValue.set(year, value));
      }
      this.totalEduDuration.set(name, this.eduDurationYearToValue)
    }
    this.maxmin = this.getMaxMinCountry(summation, year);
    let max = this.getMaxValue(year);
    let min = this.getMinValue(year);
    try {
      let temp = new Array(max - min)
    } catch (error) {
      maxColorArray = true;
    }

    let names = this.getCountryNames();
    let countries = Datamap.prototype.worldTopo.objects.world.geometries;
    for (let i = 0; i < names.length; i++) {
      for (let j = 0; j < _.size(countries); j++) {
        if (names[i] == countries[j].properties.name || countries[j].properties.name.includes(names[i])) {
          this.nameToID.set(names[i], countries[j].id);
        }
      }
    }

    let durationIDS = this.totalEduDuration.entries();
    for (let i = 0; i < this.totalEduDuration.size; i++) {
      let nameIDS = this.nameToID.entries();
      let thisduration = durationIDS.next();
      for (let j = 0; j < this.nameToID.size; j++) {
        let thisname = nameIDS.next();
        if (thisname.value[0] == thisduration.value[0]) {
          this.IDToYears.set(thisname.value[1], thisduration.value[1])
        }
      }
    }

    let colorArray = MapComponent.getColorArray(max, min, maxColorArray);
    let countryColor = this.getCountryColor(year, colorArray);
    let dataset = {};
    let countryIDS = countryColor.keys();
    for (let i = 0; i < countryColor.size; i++) {
      let thisID = countryIDS.next().value;
      dataset[thisID] = {
        scoreGiven: this.IDToYears.get(thisID).get(year),
        fillColor: countryColor.get(thisID),
        dataType: summation[0]['Units of measurement']
      };
    }

    this.title = choice + " in " + this.year.toString();
    document.getElementById("title-sentence").innerText = this.title;


    this.descriptor = dataset['USA'].dataType;
    if(this.descriptor == null){
      this.descriptor = "Units"
    }

    window.addEventListener('resize', function () {
      map.resize();
    });

    let map = new Datamap({
      element: document.getElementById('map-container'),
      responsive: true,
      projection: 'mercator',
      fills: {defaultFill: d3.rgb(0, 0, 0)},
      data: dataset,
      geographyConfig: {
        borderColor: '434244',
        borderWidth: .5,
        highlightBorderWidth: 1,
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
            return ['<div class="hoverinfo">',
              '<strong>', 'There is no data for this country', '</strong>',
              '</div>'].join('')
          }
          if (data.scoreGiven == null){
            return ['<div class="hoverinfo">',
              '<strong>', 'There is no data for ', geo.properties.name, ' in ', year, '</strong>',
              '</div>'].join('')
          }
          // tooltip content
          return ['<div class="hoverinfo">',
            '<strong>', geo.properties.name, '</strong>',
            '<br>Count: <strong>', data.scoreGiven, ' ', data.dataType, '</strong>',
            '</div>'].join('');
        }
      },
    });
  }

  constructor() { }
}
