import { Component, OnInit } from '@angular/core';
import {GDPCapitaUSDConst} from '../../assets/GDPCapitaUSDConst';
import {GDPCapitaConst2011} from '../../assets/GDPCapitaConst2011';
import {GDPCapitaCurrent} from '../../assets/GDPCapitaCurrent';
import {CompEduDuration} from '../../assets/CompEduDuration';
import {GINIWorldBankEstimate} from '../../assets/GINIWorldBankEstimate';
import {GDPCurrent} from '../../assets/GDPCurrent';
import {CompEduStartAge} from '../../assets/CompEduStartAge';
import {GDExpRNDPercGDP} from '../../assets/GDExpRNDPercGDP';
import {GDPConst2011} from '../../assets/GDPConst2011';
import * as d3 from 'd3';
import {DataService} from '../data-service/data.service';
import {P} from '@angular/core/src/render3';
import {NumberOfNewspaperTitles} from '../../assets/NumberOfNewspaperTitles';
import {SecondaryEducationAmt} from '../../assets/SecondaryEducationAmt';

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
  years: number[];
  dataType: string;
  yearType: string;
  nameType: string;
  chart: object;
  i: number;
  r: number;
  rSqr: number;
  formula: string;
  bErr: number;
  mErr: number;
  amount: number[];
  size: string;
  selectedAmt: number;
  countries: string[];
  selectedCountries: string[];
  scatterTicker: boolean[] = [false, false, false, false, false];
  residTicker: boolean[] = [false, false, false, false, false];
  oneLSRLTicker = false;
  oneResidTicker = false;
  oneResultTicker = false;
  message: number;
  countryData: object[] = [];

  constructor(private data: DataService) {
  }

  transferScatter(num) {
    this.scatterTicker[num - 1] = !this.scatterTicker[num - 1];
  }

  transferResid(num) {
    this.residTicker[num - 1] = !this.residTicker[num - 1];
  }

  hitLSRL() {
    this.oneLSRLTicker = !this.oneLSRLTicker;
  }

  hitResid() {
    this.oneResidTicker = !this.oneResidTicker;
  }

  hitResult() {
    this.oneResultTicker = !this.oneResultTicker;
  }

  showCountryOptions() {
    const list = document.getElementById('country-container').classList;
    if (list.contains('is-hidden')) {
      list.remove('is-hidden');
      this.selectedAmt = 1;
    } else {
      list.add('is-hidden');
      this.selectedAmt = 0;
    }
    this.scatterTicker = [false, false, false, false, false];
    this.residTicker = [false, false, false, false, false];
  }

  getIndexForAxis(axis) {
    if (axis == 'x') {
      for (let i = 0; i < _.size(this.choices); i++) {
        if (this.choices[i]['name'] == this.selectedX) {
          return i;
        }
      }
    } else if (axis == 'y') {
      for (let i = 0; i < _.size(this.choices); i++) {
        if (this.choices[i]['name'] == this.selectedY) {
          return i;
        }
      }
    }
    return null;
  }

  getType(data, global= false, name= false, rtData= false, year= false) {
    if (!global) {
      if (data[0]['Time Period'] != null) {
        this.yearType = 'Time Period';
        this.dataType = 'Observation Value';
        this.nameType = 'Reference Area';
      } else {
        this.yearType = 'Year';
        this.dataType = 'Value';
        this.nameType = 'Country or Area';
      }
    } else {
      if (name) {
        if (data[0]['Reference Area'] != null) {
          return 'Reference Area';
        }
        return 'Country or Area';
      }
      if (rtData) {
        if (data[0]['Observation Value'] != null) {
          return 'Observation Value';
        }
        return 'Value';
      }
      if (year) {
        if (data[0]['Time Period'] != null) {
          return 'Time Period';
        }
        return 'Year';
      }
    }
  }

  getYearsForData(one, two) {
    const years = [];
    this.getType(one);
    for (let i = 0; i < _.size(one); i++) {
      if (!years.includes(one[i][this.yearType])) {
        years.push(one[i][this.yearType]);
      }
    }
    this.getType(two);
    for (let i = 0; i < _.size(two); i++) {
      if (!years.includes(two[i][this.yearType])) {
        years.push(two[i][this.yearType]);
      }
    }
    return years.sort();
  }

  getDataBetweenYears(bgYear, edYear, data) {
    this.getType(data);
    const finalData = [];
    const range = this.fillRange(bgYear, edYear);
    for (let j = 0; j < _.size(data); j++) {
      if (range.includes(parseInt(data[j][this.yearType], 10))) {
        finalData.push(data[j]);
      }
    }
    return finalData;
  }

  uniqueAdd(arr, dataArr) {
    for (let i = 0; i < _.size(dataArr); i++) {
      const data = dataArr[i];
      this.getType(data);
      for (let j = 0; j < _.size(data); j++) {
        if (!arr.includes(data[j][this.nameType])) {
          arr.push(data[j][this.nameType]);
        }
      }
    }
    arr.sort();
  }

  createPoints(xData, yData) {
    this.countryData = [];
    const dataset = [];
    const prunedX = this.prune(xData, xData, yData);
    const prunedY = this.prune(yData, xData, yData);
    this.uniqueAdd(this.countries, [prunedX, prunedY]);
    for (let i = 0; i < _.size(prunedX); i++) {
      const standard = {
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

  prune(choice, x, y) {
    const post = [];
    this.getType(x);
    for (let i = 0; i < _.size(x); i++) {
      for (let j = 0; j < _.size(y); j++) {
        if (x[i][this.nameType] == y[j][this.getType(y, true, true)] && x[i][this.yearType] == y[j][this.getType(y, true, false, false, true)]) {
          if (choice === x) {
            post.push(x[i]);
          } else if (choice === y) {
            post.push(y[j]);
          }
        }
      }
    }
    return post;
  }

  getBackgroundColor(data) {
    let r = 1;
    let g = 1;
    let b = 1;
    const denom = _.size(data);
    const colorArray = new Array(denom);
    const chg = (255 * 3) / denom;
    for (let i = 0; i < denom; i++) {
      if (g < 255 && g > 0) {
        g += chg;
      } else {
        g = 0;
        if (r < 255 && r > 0) {
          r += chg;
        } else {
          r = 0;
          if (b < 255 && b > 0) {
            b += chg;
            if (b >= 255) {
              b = 255;
            }
          }
        }
      }
      colorArray[i] = d3.rgb(Math.floor(r), Math.floor(g), Math.floor(b));
    }
    return colorArray;
  }

  getMaxValue(data) {
    let max = 0;
    for (let i = 0; i < _.size(data); i++) {
      if (parseInt(data[i], 10) > max) {
        max = parseInt(data[i], 10);
      }
    }
    return max;
  }

  getDescriptor(data) {
    const measurement = data[0]['Units of measurement'];
    if (measurement != null) {
      return ' (in ' + measurement + ')';
    }
    if (data[0]['Item'] != null) {
      if (data[0]['Item'].includes('(GDP)')) {
        return ' (in USD)';
      }
    }
    return '';
  }

  createDataset(labelArr, dataArr, colorArr, opts) {
    const amt = _.size(dataArr);
    const results = [];
    for (let i = 0; i < amt; i++) {
      const outline = {
        label: labelArr[i],
        data: dataArr[i],
        pointBackgroundColor: colorArr[i]
      };
      const fin = Object.assign({}, outline, opts[i]);
      results.push(fin);
    }
    return results;
  }

  createGraph(dataset, tooltip= false) {
    const final = {
      type: 'scatter',
      data: {
        datasets: dataset,
      },
      options: {
        tooltips: {
          callbacks: {}
        },
        animation: false,
        scales: {
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
    if (tooltip) {
        final.options.tooltips.callbacks = {label: function(tooltipItem, data) {
          return '(' + tooltipItem.xLabel.toLocaleString() + ', ' + tooltipItem.yLabel.toLocaleString() + ')';
        },
        title: function(tooltipItem, data) {
          const choices = [
            {'name': 'Compulsory Education Duration', 'file': CompEduDuration, 'info': null},
            {'name': 'Compulsory Education Starting Age', 'file': CompEduStartAge, 'info': null},
            {'name': 'Gross Expense on R&D as a Percentage of GDP', 'file': GDExpRNDPercGDP, 'info': null},
            {'name': 'GDP Per Capita, PPP, in 2011 US Dollars', 'file': GDPCapitaConst2011, 'info': 'https://www.investopedia.com/updates/purchasing-power-parity-ppp/'},
            {'name': 'GDP Per Capita, PPP, in Current US Dollars', 'file': GDPCapitaCurrent, 'info': 'https://www.investopedia.com/updates/purchasing-power-parity-ppp/'},
            {'name': 'Total GDP, PPP, in 2011 US Dollars', 'file': GDPConst2011, 'info': 'https://www.investopedia.com/updates/purchasing-power-parity-ppp/'},
            {'name': 'Total GDP, PPP, in Current US Dollars', 'file': GDPCurrent, 'info': 'https://www.investopedia.com/updates/purchasing-power-parity-ppp/'},
            {'name': 'GINI Index (World Bank Estimate)', 'file': GINIWorldBankEstimate, 'info': 'https://www.investopedia.com/terms/g/gini-index.asp'},
            {'name': 'GDP Per Capita in Current US Dollars', 'file': GDPCapitaUSDConst, 'info': 'https://www.investopedia.com/terms/p/per-capita-gdp.asp'},
            {'name': 'Number of Newspaper Titles', 'file': NumberOfNewspaperTitles},
            {'name': 'Secondary Education Amount', 'file': SecondaryEducationAmt},
          ];
          const titleSplit = data.datasets[0].label.split(' vs ');
          let dataX = null;
          let dataY = null;
          for (let i = 0; i < _.size(choices); i++) {
            if (choices[i]['name'] == titleSplit[0].trim()) {
              dataX = JSON.parse(choices[i]['file']);
            }
            if (choices[i]['name'] == titleSplit[1].trim()) {
              dataY = JSON.parse(choices[i]['file']);
            }
          }
          let name = '';
          for (let i = 0; i < _.size(choices); i++) {
            const file = dataX;
            for (let j = 0; j < _.size(file); j++) {
              if (file[j]['Value'] == tooltipItem[0].xLabel) {
                for (let k = 0; k < _.size(dataY); k++) {
                  if (dataY[k]['Value'] == tooltipItem[0].yLabel) {
                    name = file[j]['Country or Area'];
                    if (name == null) {
                      name = dataY[k]['Country or Area'];
                    }
                    return name + ', ' + file[j]['Year'];
                  }
                  if (dataY[k]['Observation Value'] == tooltipItem[0].yLabel) {
                    name = file[j]['Country or Area'];
                    if (name == null) {
                      name = dataY[k]['Reference Area'];
                    }
                    return name + ', ' + file[j]['Year'];
                  }
                }
              }
              if (file[j]['Observation Value'] == tooltipItem[0].xLabel) {
                for (let k = 0; k < _.size(dataY); k++) {
                  if (dataY[k]['Value'] == tooltipItem[0].yLabel) {
                    name = dataY[k]['Country or Area'];
                    if (name == null) {
                      name = file[j]['Reference Area'];
                    }
                    return name + ', ' + file[j]['Time Period'];
                  }
                  if (dataY[k]['Observation Value'] == tooltipItem[0].yLabel) {
                    name = file[j]['Reference Area'];
                    if (name == null) {
                      name = dataY[k]['Reference Area'];
                    }
                    return name + ', ' + file[j]['Time Period'];
                  }
                }
              }
            }
          }
        }
      };
    }
    return final;
  }

  getDataFromCountryName(data, name) {
    const results = [];
    this.getType(data);
    for (let i = 0; i < _.size(data); i++) {
      if (data[i]['name'] == name) {
        results.push(data[i]);
      }
    }
    return results.sort();
  }

  fillRange(bg, ed) {
    if (bg > ed) {
      const temp = bg;
      bg = ed;
      ed = temp;
    }
    const range = [];
    for (let i = parseInt(bg, 10); i <= parseInt(ed, 10); i++) {
      range.push(i);
    }
    return range;
  }

  showGraph() {
    document.getElementById('map-container').classList.add('is-hidden');
    document.getElementById('graph-container').classList.remove('is-hidden');
  }

  removePreviousGraph() {
    $('#scatter-plot').remove();
    $('#line-graph-container').append('<canvas id="scatter-plot"></canvas>');
    $('#bottom-plot').remove();
    $('#output-container').append('<canvas id="bottom-plot"></canvas>');
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message);
    this.data.currentCountriesList.subscribe(selectedCountries => this.selectedCountries = selectedCountries);
    this.choices = [
      {'name': 'Compulsory Education Duration', 'file': CompEduDuration, 'info': null},
      {'name': 'Compulsory Education Starting Age', 'file': CompEduStartAge, 'info': null},
      {'name': 'Gross Expense on R&D as a Percentage of GDP', 'file': GDExpRNDPercGDP, 'info': null},
      {'name': 'GDP Per Capita, PPP, in 2011 US Dollars', 'file': GDPCapitaConst2011, 'info': 'https://www.investopedia.com/updates/purchasing-power-parity-ppp/'},
      {'name': 'GDP Per Capita, PPP, in Current US Dollars', 'file': GDPCapitaCurrent, 'info': 'https://www.investopedia.com/updates/purchasing-power-parity-ppp/'},
      {'name': 'Total GDP, PPP, in 2011 US Dollars', 'file': GDPConst2011, 'info': 'https://www.investopedia.com/updates/purchasing-power-parity-ppp/'},
      {'name': 'Total GDP, PPP, in Current US Dollars', 'file': GDPCurrent, 'info': 'https://www.investopedia.com/updates/purchasing-power-parity-ppp/'},
      {'name': 'GINI Index (World Bank Estimate)', 'file': GINIWorldBankEstimate, 'info': 'https://www.investopedia.com/terms/g/gini-index.asp'},
      {'name': 'GDP Per Capita in Current US Dollars', 'file': GDPCapitaUSDConst, 'info': 'https://www.investopedia.com/terms/p/per-capita-gdp.asp'},
      {'name': 'Number of Newspaper Titles', 'file': NumberOfNewspaperTitles},
    ];
    this.begYear = 2000;
    this.endYear = 2010;
    this.selectedAmt = 0;
    this.selectedX = 'Gross Expense on R&D as a Percentage of GDP';
    this.selectedY = 'GDP Per Capita in Current US Dollars';
    const x = this.getIndexForAxis('x');
    const y = this.getIndexForAxis('y');
    this.dataX = JSON.parse(this.choices[x]['file']);
    this.dataY = JSON.parse(this.choices[y]['file']);
    this.years = this.getYearsForData(this.dataX, this.dataY);
    this.i = 0;
    this.amount = this.fillRange(1, 5);
    this.countries = [];
    const triggerFunc = this.createPoints(this.getDataBetweenYears(this.begYear, this.endYear, this.dataX), this.getDataBetweenYears(this.begYear, this.endYear, this.dataY));
    this.selectedCountries = [];
    for (let i = 0; i < this.selectedAmt; i++) {
      this.selectedCountries[i] = this.countries[i];
    }
  }

  updateDataServices() {
    this.data.changeIsScatter(this.scatterTicker);
    this.data.changeIsResid(this.residTicker);
    this.data.changeIsOneLSRL(this.oneLSRLTicker);
    this.data.changeIsOneResid(this.oneResidTicker);
    this.data.changeIsOneResult(this.oneResultTicker);
  }

  async graphTabSubmit() {
    this.data.changeMessage(parseInt(String(this.selectedAmt), 10));
    this.data.changeCountriesList(this.selectedCountries);

    this.i++;
    this.showGraph();
    this.removePreviousGraph();

    const x = this.getIndexForAxis('x');
    const y = this.getIndexForAxis('y');
    this.dataX = JSON.parse(this.choices[x]['file']);
    this.dataY = JSON.parse(this.choices[y]['file']);

    const yearlyDataX = this.getDataBetweenYears(this.begYear, this.endYear, this.dataX);
    const yearlyDataY = this.getDataBetweenYears(this.begYear, this.endYear, this.dataY);

    this.descriptorX = this.getDescriptor(this.dataX);
    this.descriptorY = this.getDescriptor(this.dataY);

    const finalDatasetData = this.createPoints(yearlyDataX, yearlyDataY);
    const colors = this.getBackgroundColor(finalDatasetData);

    const LSRLX = [];
    const LSRLY = [];
    for (let i = 0; i < _.size(finalDatasetData); i++) {
      LSRLX.push(finalDatasetData[i].x);
      LSRLY.push(finalDatasetData[i].y);
    }
    const ret = {};

    const f = lsq(LSRLX, LSRLY, true, ret);
    const LSRLData = [];
    for (let i = 0; i < this.getMaxValue(LSRLX); i += (1 / 35 * this.getMaxValue(LSRLX))) {
      LSRLData.push({x: i, y: f(i)});
    }

    const residData = [];
    for (let i = 0; i < _.size(finalDatasetData); i++) {
      const residX = finalDatasetData[i]['x'];
      const residY = finalDatasetData[i]['y'];
      residData.push({x: residX, y: residY - f(residX)});
    }

    this.formula = 'y = ' + ret['m'].toFixed(5) + ' * x + ' + ret['b'].toFixed(5);
    this.r = 0;
    this.rSqr = this.r * this.r;
    this.bErr = ret['bErr'].toFixed(5);
    this.mErr = ret['mErr'].toFixed(5);

    if (this.oneResultTicker) {
      document.getElementById('r').innerText = '' + this.r.toFixed(5);
      document.getElementById('rSqr').innerText = '' + this.rSqr.toFixed(5);
      document.getElementById('formula').innerText = '' + this.formula;
      document.getElementById('bErr').innerText = '' + this.bErr;
      document.getElementById('mErr').innerText = '' + this.mErr;
    }

    const title = [
      this.selectedX + '\n vs \n' + this.selectedY];
    const data = [finalDatasetData];
    const color: any[] = [colors];
    const opts = [{}];

    if (this.oneLSRLTicker) {
      title.push('Least Squared Regression Line');
      data.push(LSRLData);
      color.push('F0F0F0');
      opts.push({type: 'line',
        showLine: true,
        backgroundColor: '#F0F0F0',
        fill: false});
    }

    const finalDatasets = this.createDataset(title, data, color, opts);

    const finalResid = this.createDataset([
      this.selectedX + '\n vs \n' + this.selectedY],
      [residData],
      [colors],
      [{}]
      );

    const finalChart = this.createGraph(finalDatasets, true);
    const residualChart = this.createGraph(finalResid, false);

    document.getElementById('title-sentence').innerText = finalDatasets[0].label + ' \nfrom ' + this.begYear + ' to ' + this.endYear;
    if (this.oneResidTicker) {
      const resid = document.getElementById('bottom-plot');
      new chart.Chart(resid, residualChart);
    }
    const ctx = document.getElementById('scatter-plot');
    this.chart = new chart.Chart(ctx, finalChart);

    for (let i = 0; i < this.selectedAmt; i++) {
      let countryCanvas = null;
      //loop is ind country
      const residualCheck = this.residTicker[i];
      const scatterCheck = this.scatterTicker[i];
      const countryName = this.selectedCountries[i];
      const thiscountryData = this.getDataFromCountryName(this.countryData, countryName);
      const colors = this.getBackgroundColor(thiscountryData);
      const LSRLX = [];
      const LSRLY = [];
      let countryResidData = [];
      const ret = {};
      for (let i = 0; i < _.size(thiscountryData); i++) {
        LSRLX.push(thiscountryData[i].x);
        LSRLY.push(thiscountryData[i].y);
        const f = lsq(LSRLX, LSRLY, true, ret);
        const LSRLData = [];
        for (let i = 0; i < this.getMaxValue(LSRLX); i += (1 / 35 * this.getMaxValue(LSRLX))) {
          LSRLData.push({x: i, y: f(i)});
        }
        countryResidData = [];
        for (let i = 0; i < _.size(thiscountryData); i++) {
          const residX = thiscountryData[i]['x'];
          const residY = thiscountryData[i]['y'];
          countryResidData.push({x: residX, y: residY - f(residX)});
        }
      }

      const formula = 'y = ' + ret['m'].toFixed(5) + ' * x + ' + ret['b'].toFixed(5);
      const r = 0;
      const rSqr = r * r;
      const bErr = ret['bErr'].toFixed(5);
      const mErr = ret['mErr'].toFixed(5);
      document.getElementById('country-formula-' + (i + 1)).innerText = formula;
      document.getElementById('country-r-' + (i + 1)).innerText = String(r);
      document.getElementById('country-rSqr-' + (i + 1)).innerText = String(rSqr);
      document.getElementById('country-bErr-' + (i + 1)).innerText = String(bErr);
      document.getElementById('country-mErr-' + (i + 1)).innerText = String(mErr);
      if (scatterCheck) {
        const countryGraph = this.createDataset(
          [countryName + ' Scatter Plot'],
          [thiscountryData],
          [colors],
          [{}]
        );
        const countryChart = this.createGraph(countryGraph, false);
        countryCanvas = document.getElementById('country-canvas-' + (i + 1));
        new chart.Chart(countryCanvas, countryChart);
      }
      if (residualCheck) {
        const residGraph = this.createDataset(
          [countryName + ' Residual Plot'],
          [countryResidData],
          [colors],
          [{}]
        );
        const residChart = this.createGraph(residGraph, false);
        const residCanvas = document.getElementById('resid-canvas-' + (i + 1));
        new chart.Chart(residCanvas, residChart);
      }
    }
  }
}
