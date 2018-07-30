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
  info: string;


  getMaxValueFromData(data){
    let max = -1000000000;
    for (let item in data) {
      if (data[item][this.dataType] != null && data[item][this.dataType] > max) {
        max = data[item][this.dataType];
      }
    }
    return max;
  }

  getMinValueFromData(data){
    let min = 1000000000;
    for (let item in data) {
      if (data[item][this.dataType] != null && data[item][this.dataType] < min) {
        min = data[item][this.dataType];
      }
    }
    return min;
  }

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

  getColorArray(max, min, isReverseColor=false){
    let r = 255;
    let g = 0;
    let b = 0;
    let denom = max-min;
    let isLargeArray = false;
    try{
      let temp = new Array(denom);
      isLargeArray = false;
    } catch(error){
      isLargeArray = true;
    }
    if(isLargeArray) {
      let divvy = 15;
      let colorArray = new Array(15);
      let chg = 510/15;
      for(let i = 0; i < divvy; i++){
        if(g < 255){
          g += chg;
          if(isReverseColor){
            colorArray[i] = d3.rgb(Math.floor(g), r, b);
          } else{
            colorArray[i] = d3.rgb(r, Math.floor(g), b);
          }
        }
        if(g > 255){
          g -= (g-255)
        }
        if(g == 255) {
          r -= chg;
          if(r < 0){
            r = 0;
          }
          if(isReverseColor){
            colorArray[i] = d3.rgb(g, Math.floor(r), b);
          } else{
            colorArray[i] = d3.rgb(Math.floor(r), g, b);
          }
        }
      }
      return colorArray
    }
    let colorArray = new Array(denom);
    let chg = (510)/denom;
    for(let i = 0; i < denom; i++){
      if(g < 255){
        g += chg;
        if(isReverseColor){
          colorArray[i] = d3.rgb(Math.floor(g), r, b);
        } else{
          colorArray[i] = d3.rgb(r, Math.floor(g), b);
        }
      }
      if(g > 255){
        g -= (g-255)
      }
      if(g == 255) {
        r -= chg;
        if(r < 0){
          r = 0;
        }
        if(isReverseColor){
          colorArray[i] = d3.rgb(Math.floor(g), r, b);
        } else{
          colorArray[i] = d3.rgb(r, Math.floor(g), b);
        }
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
      let thisColor = colors[countryScore-(this.getMinValue(year)+1)];
      if(countryScore == this.getMaxValue(year)){
        thisColor = colors[divvy-1];
      }
      if(countryScore == this.getMinValue(year)){
        thisColor = colors[0];
      }
      if(countryScore != null){
        countryToColor.set(thisyear, thisColor);
      } else{
        countryToColor.set(thisyear, d3.rgb('#878E99'));
      }
    }
    return countryToColor;
  }

  removePreviousMap(){
    document.getElementById('map-container').children.item(0).remove();
    document.getElementById('map-container').children.item(0).remove();
  }

  getAllYears(data){
    let years = [];
    for(let i = 0; i < _.size(data); i++){
      if(!years.includes(data[i][this.yearType])){
        years.push(data[i][this.yearType]);
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
      if (Math.floor(dataPointValue).toString().length >= 8) {
        dataPointValue = Math.floor(dataPointValue / 1000000000);
      }
      if(perc){
        dataPointValue = Math.floor(10 * dataPointValue);
      }
      if(Math.floor(dataPointValue) == max){
        if(!extremaCountries['max'].includes(dataPointName)) {
          extremaCountries['max'].push(dataPointName);
        }
      }
      if(Math.floor(dataPointValue) == min){
        if(!extremaCountries['min'].includes(dataPointName)) {
          extremaCountries['min'].push(dataPointName);
        }
      }
    }
    return extremaCountries
  }

  getIndexOfCountry(data, countryName){
    for(let i = 0; i < _.size(data); i++){
      if(data[i][this.nameType].includes(countryName)){
        return i;
      }
    }
    return null;
  }

  generateRatioDataSet(begData, endData) {
    let results = [];
    for(let i = 0; i < _.size(begData); i++) {
      let index = this.getIndexOfCountry(endData, begData[i][this.nameType]);
      //await this.sleep(3000);
      let dataPoint = {};
      if(index != null) {
        let begIndex = begData[i];
        let endIndex = endData[index];
        dataPoint['isComplete'] = true;
        dataPoint[this.nameType] = begIndex[this.nameType];
        dataPoint[this.yearType] = (endIndex[this.yearType] - begIndex[this.yearType]);
        dataPoint['Units of Measurement'] = "Percent";
        dataPoint[this.dataType] = Math.round(((endIndex[this.dataType] - begIndex[this.dataType]) / begIndex[this.dataType]) * 100);
      } else {
        dataPoint['isComplete'] = false;
        dataPoint[this.nameType] = begData[i][this.nameType];
      }
      results.push(dataPoint);
    }
    return results;
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  getColorForIndCountry(name, data, colors) {
    let result = null;
    let index = this.getIndexOfCountry(data, name);
    let value = data[index].value;

    return result
  }

  ngOnInit(selectedData=null, selectedYear=null, ratio=false){

    this.choices = [
      {'name': "Compulsory Education Duration", 'file': CompEduDuration, 'info': null},
      {'name': "Compulsory Education Starting Age", 'file': CompEduStartAge, 'info': null},
      {'name': "Gross Expense on R&D as a Percentage of GDP", 'file': GDExpRNDPercGDP, 'info': null},
      {'name': "GDP Per Capita in 2011 US Dollars", 'file': GDPCapitaConst2011, 'info': 'https://www.investopedia.com/terms/p/per-capita-gdp.asp'},
      {'name': "GDP Per Capita in Current US Dollars", 'file': GDPCapitaCurrent, 'info': 'https://www.investopedia.com/terms/p/per-capita-gdp.asp'},
      {'name': "Total GDP in 2011 US Dollars", 'file': GDPConst2011, 'info': 'https://www.investopedia.com/terms/g/gdp.asp'},
      {'name': "Total GDP in Current US Dollars", 'file': GDPCurrent, 'info': 'https://www.investopedia.com/terms/g/gdp.asp'},
      {'name': "GINI Index (World Bank Estimate)", 'file': GINIWorldBankEstimate, 'info': 'https://www.investopedia.com/terms/g/gini-index.asp'}
    ];
    let choice = selectedData;

    let isReverseColor = false;
    let perc;
    let maxColorArray;

    if(choice == null){
      choice = "Compulsory Education Duration";
    }
    let k = 0;
    for(let i = 0; i < this.choices.length; i++){
      if(this.choices[i]['name'] == choice){
        k = i;
      }
    }
    let summation = JSON.parse(this.choices[k]['file']);
    this.parsedData = "";
    if (summation[0]['Units of measurement'] == "Percent") {
      perc = true;
    }
    if (summation[0]['Value'] != null) {
      this.dataType = 'Value';
      this.nameType = 'Country or Area';
      this.yearType = 'Year';
    } else {
      this.dataType = 'Observation Value';
      this.nameType = 'Reference Area';
      this.yearType = 'Time Period';
    }
    let GDP = false;
    if(this.choices[k]['name'].includes("Total GDP")){
      GDP = true
    }
    if(this.choices[k]['name'].includes("GINI")){
      isReverseColor = true;
    }
    this.info = this.choices[k]['info'];

    let defaultFill = '#182233';

    if(ratio) {
      let begYear = parseInt(selectedYear[0]);
      let endYear = parseInt(selectedYear[1]);
      let dataBeg = this.getDataForYear(summation, begYear);
      let dataEnd = this.getDataForYear(summation, endYear);
      let ratioMap = this.generateRatioDataSet(dataBeg, dataEnd);
      let maxValue = this.getMaxValueFromData(ratioMap);
      let minValue = this.getMinValueFromData(ratioMap);
      let allRatioColors = this.getColorArray(maxValue, minValue);
      console.log(ratioMap);
      let dataset = {};
      for (let i = 0; i < _.size(ratioMap); i++){

      }
    } else {

      this.IDToYears = new Map<string, Map<number, number>>();
      this.nameToID = new Map<string, string>();
      this.totalEduDuration = new Map<string, Map<number, number>>();
      this.eduDurationYearToValue = new Map<number, number>();
      this.eduDurationParsed = new Map<string, Map<number, number>>();
      this.year = parseInt(selectedYear);

      if (selectedYear == null) {
        this.year = 2010;
      }
      let year = this.year;

      for (let i = 0; i < _.size(summation); i++) {
        let name = summation[i][this.nameType];
        let year = summation[i][this.yearType];
        let value = summation[i][this.dataType];
        if (GDP) {
          value = Math.floor(value / 1000000000);
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
      this.allYears = this.getAllYears(summation);
      this.maxmin = this.getMaxMinCountry(summation, year);
      let max = this.getMaxValue(year);
      let min = this.getMinValue(year);

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

      let colorArray = this.getColorArray(max, min, isReverseColor);
      let countryColor = this.getCountryColor(year, colorArray);
      let dataset = {};
      let countryIDS = countryColor.keys();
      for (let i = 0; i < countryColor.size; i++) {
        let thisID = countryIDS.next().value;
        let finScore = this.IDToYears.get(thisID).get(year);
        let finScoreString;
        try {
          finScoreString = finScore.toLocaleString();
          finScore = finScoreString;
        }
        catch (error) {
        }
        dataset[thisID] = {
          scoreGiven: finScore,
          fillColor: countryColor.get(thisID),
          dataType: summation[0]['Units of measurement']
        };
      }

      this.title = choice + " in " + this.year.toString();
      document.getElementById("title-sentence").innerText = this.title;

      this.descriptor = dataset['USA'].dataType;
      if (this.descriptor == null) {
        this.descriptor = "Units";
        let countryIDS = countryColor.keys();
        for (let i = 0; i < _.size(dataset); i++) {
          let thisID = countryIDS.next().value;
          dataset[thisID]['dataType'] = "Units"
        }
      }

      window.addEventListener('resize', function () {
        map.resize();
      });

      console.log(dataset, "dataset");
      let map = new Datamap({
        element: document.getElementById('map-container'),
        responsive: true,
        projection: 'mercator',
        fills: {defaultFill: defaultFill},
        data: dataset,
        geographyConfig: {
          borderColor: '434244',
          borderWidth: .5,
          highlightBorderWidth: 1,
          highlightFillColor: function (geo) {
            return geo['fillColor'] || defaultFill;
          },
          highlightBorderColor: '#B7B7B7',
          popupTemplate: function (geo, data) {
            if (!data) {
              return ['<div class="hoverinfo">',
                '<strong>', 'There is no data for this country from this dataset.', '</strong>',
                '</div>'].join('')
            }
            if (data.scoreGiven == null) {
              return ['<div class="hoverinfo">',
                '<strong>', 'There is no data for ', geo.properties.name, ' in ', year, '</strong>',
                '</div>'].join('')
            }
            return ['<div class="hoverinfo">',
              '<strong>', geo.properties.name, '</strong>',
              '<br>Count: <strong>', data.scoreGiven, ' ', data.dataType, '</strong>',
              '</div>'].join('');
          }
        },
      });
    }
  }
  constructor() { }
}
