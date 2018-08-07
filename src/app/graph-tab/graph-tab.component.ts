import { Component, OnInit } from '@angular/core';
import {GDPCapitaUSDConst} from "../../assets/GDPCapitaUSDConst";
import {GDPCapitaConst2011} from "../../assets/GDPCapitaConst2011";
import {GDPCapitaCurrent} from "../../assets/GDPCapitaCurrent";
import {CompEduDuration} from "../../assets/CompEduDuration";
import {GINIWorldBankEstimate} from "../../assets/GINIWorldBankEstimate";
import {GDPCurrent} from "../../assets/GDPCurrent";
import {CompEduStartAge} from "../../assets/CompEduStartAge";
import {GDExpRNDPercGDP} from "../../assets/GDExpRNDPercGDP";
import {GDPConst2011} from "../../assets/GDPConst2011";
import * as d3 from "d3";
import {DataService} from "../data-service/data.service";

declare var require: any;
const chart = require('chart.js');
const _ = require('underscore');
const $ = require('jquery');
const lsq = require('least-squares');

@Component({
  selector: 'app-graph-tab',
  templateUrl: './graph-tab.component.html',
  styleUrls: ['./graph-tab.component.css']
})
export class GraphTabComponent implements OnInit {
  begYear: number;
  endYear: number;
  selectedX: string;
  selectedY: string;
  dataX: object;
  dataY: object;
  country: string;
  choices: object;
  descriptorX: string;
  descriptorY: string;
  years:number[];
  dataType:string;
  yearType:string;
  nameType:string;
  chart:object;
  i:number;
  r:number;
  rSqr:number;
  formula:string;
  bErr:number;
  mErr:number;
  amount:number[];
  size:string;
  selectedAmt:number;
  countries:string[];
  selectedCountries:string[];
  scatterTicker:boolean[]=[false, false, false, false, false];
  residTicker:boolean[]=[false, false, false, false, false];
  message:number;
  countryData:object[]=[];

  constructor(private data: DataService) {
  }

  newMessage() {

  }

  transferScatter(num){
    this.scatterTicker[num-1] = !this.scatterTicker[num-1]
  }

  transferResid(num){
    this.residTicker[num-1] = !this.residTicker[num-1]
  }


  showCountryOptions(){
    let list = document.getElementById("country-container").classList;
    if(list.contains('is-hidden')){
      list.remove('is-hidden');
      this.selectedAmt=1;
    } else{
      list.add('is-hidden');
      this.selectedAmt=0;
    }
    this.scatterTicker=[false, false, false, false, false];
    this.residTicker=[false, false, false, false, false];
  }

  getIndexForAxis(axis){
    if (axis == "x"){
      for(let i = 0; i < _.size(this.choices); i++){
        if(this.choices[i]['name'] == this.selectedX){
          return i;
        }
      }
    }
    else if(axis == "y") {
      for(let i = 0; i < _.size(this.choices); i++){
        if(this.choices[i]['name'] == this.selectedY){
          return i;
        }
      }
    }
    return null;
  }

  getType(data, global=false, name=false, rtData=false, year=false){
    if(!global) {
      if (data[0]['Time Period'] != null) {
        this.yearType = "Time Period";
        this.dataType = "Observation Value";
        this.nameType = "Reference Area";
      } else {
        this.yearType = "Year";
        this.dataType = "Value";
        this.nameType = "Country or Area";
      }
    } else {
      if(name){
        if(data[0]['Reference Area'] != null){
          return "Reference Area";
        }
        return "Country or Area";
      }
      if(rtData){
        if(data[0]['Observation Value'] != null){
          return "Observation Value";
        }
        return "Value";
      }
      if(year){
        if(data[0]['Time Period'] != null){
          return "Time Period";
        }
        return "Year";
      }
    }
  }

  getYearsForData(one, two){
    let years = [];
    this.getType(one);
    for(let i = 0; i < _.size(one); i++){
      if(!years.includes(one[i][this.yearType])){
        years.push(one[i][this.yearType])
      }
    }
    this.getType(two);
    for(let i = 0; i < _.size(two); i++){
      if(!years.includes(two[i][this.yearType])){
        years.push(two[i][this.yearType])
      }
    }
    return years.sort();
  }

  getDataBetweenYears(bgYear, edYear, data){
    this.getType(data);
    let finalData = [];
    let range = this.fillRange(bgYear, edYear);
    for(let j = 0; j < _.size(data); j++){
      if(range.includes(parseInt(data[j][this.yearType]))){
        finalData.push(data[j]);
      }
    }
    return finalData
  }

  uniqueAdd(arr, dataArr){
    for(let i = 0; i < _.size(dataArr); i++){
      let data = dataArr[i];
      this.getType(data);
      for(let j = 0; j < _.size(data); j++){
        if(!arr.includes(data[j][this.nameType])){
          arr.push(data[j][this.nameType])
        }
      }
    }
    arr.sort();
  }

  createPoints(xData, yData){
    this.countryData = [];
    let dataset = [];
    let prunedX = this.prune(xData, xData, yData);
    let prunedY = this.prune(yData, xData, yData);
    this.uniqueAdd(this.countries, [prunedX, prunedY]);
    for(let i = 0; i < _.size(prunedX); i++){
      let standard = {
        x: 0,
        y: 0,
      };
      this.getType(xData);
      standard.x = prunedX[i][this.dataType];
      this.getType(yData);
      standard.y = prunedY[i][this.dataType];
      dataset.push(standard);
      standard['name'] = prunedY[i][this.nameType];
      standard['year'] = prunedY[i][this.yearType];
      this.countryData.push(standard);
    }
    this.countryData.sort();
    return dataset;
  }

  prune(choice, x, y){
    let post = [];
    this.getType(x);
    for(let i = 0; i < _.size(x); i++){
      for(let j = 0; j < _.size(y); j++){
        if(x[i][this.nameType] == y[j][this.getType(y, true, true)] && x[i][this.yearType] == y[j][this.getType(y, true, false, false, true)]){
          if(choice === x){
            post.push(x[i]);
          } else if(choice === y){
            post.push(y[j]);
          }
        }
      }
    }
    return post;
  }

  getBackgroundColor(data){
    let r = 1;
    let g = 1;
    let b = 1;
    let denom = _.size(data);
    let colorArray = new Array(denom);
    let chg = (255*3)/denom;
    for(let i = 0; i < denom; i++){
      if(g < 255 && g > 0){
        g += chg;
      } else {
        g = 0;
        if(r < 255 && r > 0) {
          r += chg;
        } else {
          r = 0;
          if(b < 255 && b > 0) {
            b += chg;
            if (b >= 255) {
              b = 255;
            }
          }
        }
      }
      colorArray[i] = d3.rgb(Math.floor(r), Math.floor(g), Math.floor(b));
    }
    return colorArray
  }

  getMaxValue(data){
    let max = 0;
    for(let i = 0; i < _.size(data); i++){
      if (parseInt(data[i]) > max){
        max = parseInt(data[i]);
      }
    }
    return max;
  }

  getDescriptor(data){
    let measurement = data[0]['Units of measurement'];
    if(measurement != null){
      return " (in " + measurement + ")";
    }
    if(data[0]['Item'] != null){
      if(data[0]['Item'].includes("(GDP)")) {
        return " (in USD)"
      }
    }
    return "";
  }

  createDataset(labelArr, dataArr, colorArr, opts){
    let amt = _.size(dataArr);
    let results = [];
    for(let i = 0; i < amt; i++){
      let outline = {
        label: labelArr[i],
        data: dataArr[i],
        pointBackgroundColor: colorArr[i]
      };
      let fin = Object.assign({}, outline, opts[i]);
      results.push(fin)
    }
    return results;
  }

  createGraph(dataset, tooltip=false){
    let final = {
      type: 'scatter',
      data: {
        datasets: dataset,
      },
      options: {
        tooltips:{
          callbacks: {}
        },
        animation: false,
        scales:{
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.selectedX + this.descriptorX
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.selectedY + this.descriptorY
            }
          }],
        },
        pan: {
          enabled: true,
          mode: 'xy'
        },
        zoom: {
          enabled: true,
          drag: true,
          mode: 'xy'
        }
      }
    };
    if(tooltip){
        final.options.tooltips.callbacks =
          {label: function(tooltipItem, data){
          return "(" + tooltipItem.xLabel.toLocaleString() + ", " + tooltipItem.yLabel.toLocaleString() + ")";
        },
        title: function(tooltipItem, data){
          let choices = [
            {'name': "Compulsory Education Duration", 'file': CompEduDuration, 'info': null},
            {'name': "Compulsory Education Starting Age", 'file': CompEduStartAge, 'info': null},
            {'name': "Gross Expense on R&D as a Percentage of GDP", 'file': GDExpRNDPercGDP, 'info': null},
            {'name': "GDP Per Capita, PPP, in 2011 US Dollars", 'file': GDPCapitaConst2011, 'info': 'https://www.investopedia.com/updates/purchasing-power-parity-ppp/'},
            {'name': "GDP Per Capita, PPP, in Current US Dollars", 'file': GDPCapitaCurrent, 'info': 'https://www.investopedia.com/updates/purchasing-power-parity-ppp/'},
            {'name': "Total GDP, PPP, in 2011 US Dollars", 'file': GDPConst2011, 'info': 'https://www.investopedia.com/updates/purchasing-power-parity-ppp/'},
            {'name': "Total GDP, PPP, in Current US Dollars", 'file': GDPCurrent, 'info': 'https://www.investopedia.com/updates/purchasing-power-parity-ppp/'},
            {'name': "GINI Index (World Bank Estimate)", 'file': GINIWorldBankEstimate, 'info': 'https://www.investopedia.com/terms/g/gini-index.asp'},
            {'name': "GDP Per Capita in Current US Dollars", 'file': GDPCapitaUSDConst, 'info': 'https://www.investopedia.com/terms/p/per-capita-gdp.asp'}
          ];
          let titleSplit = data.datasets[0].label.split(" vs ");
          let dataX = null;
          let dataY = null;
          for(let i = 0; i < _.size(choices); i++){
            if(choices[i]['name'] == titleSplit[0].trim()){
              dataX = JSON.parse(choices[i]['file']);
            }
            if(choices[i]['name'] == titleSplit[1].trim()){
              dataY = JSON.parse(choices[i]['file']);
            }
          }
          let name = "";
          for(let i = 0; i < _.size(choices); i++){
            let file = dataX;
            for(let j = 0; j < _.size(file); j++){
              if(file[j]['Value'] == tooltipItem[0].xLabel){
                for(let k = 0; k < _.size(dataY); k++){
                  if(dataY[k]['Value'] == tooltipItem[0].yLabel){
                    name = file[j]['Country or Area'];
                    if (name == null){
                      name = dataY[k]['Country or Area']
                    }
                    return name + ", " + file[j]['Year'];
                  }
                  if(dataY[k]['Observation Value'] == tooltipItem[0].yLabel){
                    name = file[j]['Country or Area'];
                    if (name == null){
                      name = dataY[k]['Reference Area']
                    }
                    return name + ", " + file[j]['Year'];
                  }
                }
              }
              if(file[j]['Observation Value'] == tooltipItem[0].xLabel){
                for(let k = 0; k < _.size(dataY); k++){
                  if(dataY[k]['Value'] == tooltipItem[0].yLabel){
                    name = dataY[k]['Country or Area'];
                    if (name == null){
                      name = file[j]['Reference Area'];
                    }
                    return name + ", " + file[j]['Time Period'];
                  }
                  if(dataY[k]['Observation Value'] == tooltipItem[0].yLabel){
                    name = file[j]['Reference Area'];
                    if (name == null){
                      name = dataY[k]['Reference Area']
                    }
                    return name + ", " + file[j]['Time Period'];
                  }
                }
              }
            }
          }
        }
      }
    }
    return final;
  }

  getDataFromCountryName(data, name){
    let results = [];
    this.getType(data);
    for(let i = 0; i < _.size(data); i++){
      if(data[i]['name'] == name){
        results.push(data[i]);
      }
    }
    return results.sort();
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

  showGraph(){
    document.getElementById('map-container').classList.add('is-hidden');
    document.getElementById('graph-container').classList.remove('is-hidden');
  }

  removePreviousGraph(){
    $('#scatter-plot').remove();
    $('#line-graph-container').append('<canvas id="scatter-plot"></canvas>');
    $('#bottom-plot').remove();
    $('#output-container').append('<canvas id="bottom-plot"></canvas>');
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message);
    this.data.currentCountriesList.subscribe(selectedCountries => this.selectedCountries = selectedCountries);
    this.choices = [
      {'name': "Compulsory Education Duration", 'file': CompEduDuration, 'info': null},
      {'name': "Compulsory Education Starting Age", 'file': CompEduStartAge, 'info': null},
      {'name': "Gross Expense on R&D as a Percentage of GDP", 'file': GDExpRNDPercGDP, 'info': null},
      {'name': "GDP Per Capita, PPP, in 2011 US Dollars", 'file': GDPCapitaConst2011, 'info': 'https://www.investopedia.com/updates/purchasing-power-parity-ppp/'},
      {'name': "GDP Per Capita, PPP, in Current US Dollars", 'file': GDPCapitaCurrent, 'info': 'https://www.investopedia.com/updates/purchasing-power-parity-ppp/'},
      {'name': "Total GDP, PPP, in 2011 US Dollars", 'file': GDPConst2011, 'info': 'https://www.investopedia.com/updates/purchasing-power-parity-ppp/'},
      {'name': "Total GDP, PPP, in Current US Dollars", 'file': GDPCurrent, 'info': 'https://www.investopedia.com/updates/purchasing-power-parity-ppp/'},
      {'name': "GINI Index (World Bank Estimate)", 'file': GINIWorldBankEstimate, 'info': 'https://www.investopedia.com/terms/g/gini-index.asp'},
      {'name': "GDP Per Capita in Current US Dollars", 'file': GDPCapitaUSDConst, 'info': 'https://www.investopedia.com/terms/p/per-capita-gdp.asp'}
    ];
    this.begYear = 2000;
    this.endYear = 2010;
    this.selectedAmt = 0;
    this.selectedX = "Gross Expense on R&D as a Percentage of GDP";
    this.selectedY = "GDP Per Capita in Current US Dollars";
    let x = this.getIndexForAxis("x");
    let y = this.getIndexForAxis("y");
    this.dataX = JSON.parse(this.choices[x]['file']);
    this.dataY = JSON.parse(this.choices[y]['file']);
    this.years = this.getYearsForData(this.dataX, this.dataY);
    this.i=0;
    this.amount = this.fillRange(1, 5);
    this.countries = [];
    let triggerFunc = this.createPoints(this.getDataBetweenYears(this.begYear, this.endYear, this.dataX), this.getDataBetweenYears(this.begYear, this.endYear, this.dataY))
    this.selectedCountries = [];
    for(let i = 0; i < this.selectedAmt; i++){
      this.selectedCountries[i] = this.countries[i]
    }
  }


  async graphTabSubmit() {
    this.data.changeMessage(parseInt(String(this.selectedAmt)));
    this.data.changeCountriesList(this.selectedCountries);

    this.i++;
    this.showGraph();
    this.removePreviousGraph();

    let x = this.getIndexForAxis("x");
    let y = this.getIndexForAxis("y");
    this.dataX = JSON.parse(this.choices[x]['file']);
    this.dataY = JSON.parse(this.choices[y]['file']);

    let yearlyDataX = this.getDataBetweenYears(this.begYear, this.endYear, this.dataX);
    let yearlyDataY = this.getDataBetweenYears(this.begYear, this.endYear, this.dataY);

    this.descriptorX = this.getDescriptor(this.dataX);
    this.descriptorY = this.getDescriptor(this.dataY);

    let finalDatasetData = this.createPoints(yearlyDataX, yearlyDataY);
    let colors = this.getBackgroundColor(finalDatasetData);

    let LSRLX = [];
    let LSRLY = [];
    for(let i = 0; i < _.size(finalDatasetData); i++){
      LSRLX.push(finalDatasetData[i].x);
      LSRLY.push(finalDatasetData[i].y);
    }
    let ret = {};

    let f = lsq(LSRLX, LSRLY, true, ret);
    let LSRLData = [];
    for(let i = 0; i < this.getMaxValue(LSRLX); i+=(1/35 * this.getMaxValue(LSRLX))){
      LSRLData.push({x: i, y: f(i)});
    }

    let residData = [];
    for(let i = 0; i < _.size(finalDatasetData); i++){
      let residX = finalDatasetData[i]['x'];
      let residY = finalDatasetData[i]['y'];
      residData.push({x: residX, y: residY-f(residX)})
    }

    this.formula = "y = " + ret['m'].toFixed(5) + " * x + " + ret['b'].toFixed(5);
    this.r = 0;
    this.rSqr = this.r * this.r;
    this.bErr = ret['bErr'].toFixed(5);
    this.mErr = ret['mErr'].toFixed(5);

    document.getElementById('r').innerText = "" + this.r.toFixed(5);
    document.getElementById('rSqr').innerText = "" + this.rSqr.toFixed(5);
    document.getElementById('formula').innerText = "" + this.formula;
    document.getElementById('bErr').innerText = "" + this.bErr;
    document.getElementById('mErr').innerText = "" + this.mErr;

    let finalDatasets = this.createDataset([
      this.selectedX + '\n vs \n' + this.selectedY,
      "Least Squared Regression Line"],
      [finalDatasetData,
      LSRLData],
      [colors,
      'F0F0F0'],
      [{}, {type: 'line',
      showLine: true,
      backgroundColor: '#F0F0F0',
      fill: false}]);

    let finalResid = this.createDataset([
      this.selectedX + '\n vs \n' + this.selectedY],
      [residData],
      [colors],
      [{}]
      );

    let finalChart = this.createGraph(finalDatasets, true);
    let residualChart = this.createGraph(finalResid, false);

    document.getElementById("title-sentence").innerText = finalDatasets[0].label + " \nfrom " + this.begYear + " to " + this.endYear;

    const resid = document.getElementById("bottom-plot");
    const ctx = document.getElementById("scatter-plot");
    this.chart = new chart.Chart(ctx, finalChart);
    new chart.Chart(resid, residualChart);

    for(let i = 0; i < this.selectedAmt; i++){
      //loop is ind country
      let residualCheck = this.residTicker[i];
      let scatterCheck = this.scatterTicker[i];
      let countryName = this.selectedCountries[i];
      let thiscountryData = this.getDataFromCountryName(this.countryData, countryName);
      let colors = this.getBackgroundColor(thiscountryData);

      if(scatterCheck){
        const countryGraph = this.createDataset(
          [countryName],
          [thiscountryData],
          [colors],
          [{}]
          );
        let countryChart = this.createGraph(countryGraph, true);
        const countryCanvas = document.getElementById('country-canvas-'+(i+1));
        console.log(countryCanvas);
        console.log(document.getElementById('world-info-container'))
        // new chart.Chart(countryCanvas, countryChart)
      }

      if(residualCheck){

      }
    }
  }
}
