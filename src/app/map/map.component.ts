import {Component, Input, OnInit} from '@angular/core';
import {CompEduDuration} from '../../assets/CompEduDuration';
import {GraphContainerComponent} from '../graph-container/graph-container.component';
import * as d3 from 'd3';

import { CompEduStartAge } from '../../assets/CompEduStartAge';
import { GDExpRNDPercGDP } from '../../assets/GDExpRNDPercGDP';
import { GDPCapitaConst2011 } from '../../assets/GDPCapitaConst2011';
import { GDPCapitaCurrent } from '../../assets/GDPCapitaCurrent';
import { GDPConst2011 } from '../../assets/GDPConst2011';
import { GDPCurrent } from '../../assets/GDPCurrent';
import { GINIWorldBankEstimate } from '../../assets/GINIWorldBankEstimate';
import { GDPConst2010 } from '../../assets/GDPConst2010';
import { GDPCapitaUSDConst } from '../../assets/GDPCapitaUSDConst';
import { NumberOfNewspaperTitles } from '../../assets/NumberOfNewspaperTitles';
import { SecondaryEducationAmt} from '../../assets/SecondaryEducationAmt';

declare var require: any;

const _ = require('underscore');
const Datamap = require('datamaps');

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  eduDurationYearToValue: Map<number, number>;
  eduDurationParsed: Map<string, Map<number, number>>;
  totalEduDuration: Map<string, Map<number, number>>;
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
  max: number;
  min: number;


  getMaxValueFromData(data) {
    let max = -1000000000;
    for (const item in data) {
      if (data[item][this.dataType] != null && data[item][this.dataType] > max) {
        max = data[item][this.dataType];
      }
    }
    return max;
  }

  getMinValueFromData(data) {
    let min = 1000000000;
    for (const item in data) {
      if (data[item][this.dataType] != null && data[item][this.dataType] < min) {
        min = data[item][this.dataType];
      }
    }
    return min;
  }

  getMaxValue(year) {
    year = parseInt(year);
    let max = -1000000000;
    const allKeys = this.totalEduDuration.keys();
    for (let i = 0; i < this.totalEduDuration.size; i++) {
      const country = allKeys.next();
      if ((this.totalEduDuration.get(country.value).get(year)) > max) {
        max = this.totalEduDuration.get(country.value).get(year);
      }
    }
    return max;
  }

  getMinValue(year) {
    year = parseInt(year);
    let min = 10000000000000;
    const allKeys = this.totalEduDuration.keys();
    for (let i = 0; i < this.totalEduDuration.size; i++) {
      const country = allKeys.next();
      if ((this.totalEduDuration.get(country.value).get(year)) < min ) {
        min = this.totalEduDuration.get(country.value).get(year);
      }
    }
    return min;
  }

  getColorArray(max, min, isReverseColor) {
    let r = 255;
    let g = 0;
    const b = 0;
    const denom = max - min;
    let isLargeArray = false;
    try {
      const temp = new Array(denom);
      isLargeArray = false;
    } catch (error) {
      isLargeArray = true;
    }
    if (isLargeArray) {
      const divvy = 15;
      const colorArray = new Array(15);
      const chg = 510 / 15;
      for (let i = 0; i < divvy; i++) {
        if (g < 255) {
          g += chg;
          if (isReverseColor) {
            colorArray[i] = d3.rgb(Math.floor(g), r, b);
          } else {
            colorArray[i] = d3.rgb(r, Math.floor(g), b);
          }
        }
        if (g > 255) {
          g -= (g - 255);
        }
        if (g == 255) {
          r -= chg;
          if (r < 0) {
            r = 0;
          }
          if (isReverseColor) {
            colorArray[i] = d3.rgb(g, Math.floor(r), b);
          } else {
            colorArray[i] = d3.rgb(Math.floor(r), g, b);
          }
        }
      }
      return colorArray;
    }
    const colorArray = new Array(denom);
    const chg = (510) / denom;
    for (let i = 0; i < denom; i++) {
      if (g < 255) {
        g += chg;
        if (isReverseColor) {
          colorArray[i] = d3.rgb(Math.floor(g), r, b);
        } else {
          colorArray[i] = d3.rgb(r, Math.floor(g), b);
        }
      }
      if (g > 255) {
        g -= (g - 255);
      }
      if (g == 255) {
        r -= chg;
        if (r < 0) {
          r = 0;
        }
        if (isReverseColor) {
          colorArray[i] = d3.rgb(Math.floor(g), r, b);
        } else {
          colorArray[i] = d3.rgb(r, Math.floor(g), b);
        }
      }
    }
    return colorArray;
  }

  getCountryNames() {
    const names = Array(this.totalEduDuration.size);
    const ind = this.totalEduDuration.keys();
    for (let i = 0; i < this.totalEduDuration.size; i++) {
      const next = ind.next();
      names[i] = next.value;
    }
    return names;
  }

  getCountryColor(year, colors) {
    const divvy = (this.getMaxValue(year) - this.getMinValue(year));
    const countryToColor = new Map<string, object>();
    const countryKeys = this.IDToYears.keys();
    for (let i = 0; i < this.IDToYears.size; i++) {
      const thisyear = countryKeys.next().value;
      const countryScore = this.IDToYears.get(thisyear).get(year);
      let thisColor = colors[countryScore - (this.getMinValue(year) + 1)];
      if (countryScore == this.getMaxValue(year)) {
        thisColor = colors[divvy - 1];
      }
      if (countryScore == this.getMinValue(year)) {
        thisColor = colors[0];
      }
      if (countryScore != null) {
        countryToColor.set(thisyear, thisColor);
      } else {
        countryToColor.set(thisyear, d3.rgb('#878E99'));
      }
    }
    return countryToColor;
  }

  removePreviousMap() {
    if (_.size(document.getElementById('map-container').children) >= 2) {
      document.getElementById('graph-container').classList.add('is-hidden');
      document.getElementById('map-container').classList.remove('is-hidden');
      document.getElementById('map-container').children.item(0).remove();
      document.getElementById('map-container').children.item(0).remove();
    }
  }

  getAllYears(data) {
    const years = [];
    for (let i = 0; i < _.size(data); i++) {
      if (!years.includes(data[i][this.yearType])) {
        years.push(data[i][this.yearType]);
      }
    }
    return years.sort();
  }

  getDataForYear(data, year) {
    const results = [];
    for (let i = 0; i < _.size(data); i++) {
      if (data[i][this.yearType] == parseInt(year)) {
        results.push(data[i]);
      }
    }
    return results;
  }

  getMaxMinCountryFromData(data) {
    const min = this.getMinValueFromData(data);
    const max = this.getMaxValueFromData(data);
    const extremaCountries = {
      'max': [],
      'min': []
    };
    let perc;
    for (let i = 0; i < _.size(data); i++) {
      let dataPointValue = data[i][this.dataType];
      const dataPointName = data[i][this.nameType];
      if (Math.floor(dataPointValue).toString().length >= 8) {
        dataPointValue = Math.round(dataPointValue / 1000000000);
      }
      if (perc) {
        dataPointValue = Math.round(10 * dataPointValue);
      }
      if (Math.round(dataPointValue) == max) {
        if (!extremaCountries['max'].includes(dataPointName)) {
          extremaCountries['max'].push(dataPointName);
        }
      }
      if (Math.round(dataPointValue) == min) {
        if (!extremaCountries['min'].includes(dataPointName)) {
          extremaCountries['min'].push(dataPointName);
        }
      }
      this.sleep(1000);
    }
    return extremaCountries;
  }

  getMaxMinCountry(data, year) {
    const min = this.getMinValue(year);
    const max = this.getMaxValue(year);
    const extremaCountries = {
      'max': [],
      'min': []
    };
    let perc;
    if (data[0]['Units of measurement'] == 'Percent') {
      perc = true;
    }
    const dataYear = this.getDataForYear(data, year);
    for (let i = 0; i < _.size(dataYear); i++) {
      let dataPointValue = dataYear[i][this.dataType];
      const dataPointName = dataYear[i][this.nameType];
      if (Math.floor(dataPointValue).toString().length >= 8) {
        dataPointValue = Math.floor(dataPointValue / 1000000000);
      }
      if (perc) {
        dataPointValue = Math.floor(10 * dataPointValue);
      }
      if (Math.floor(dataPointValue) == max) {
        if (!extremaCountries['max'].includes(dataPointName)) {
          extremaCountries['max'].push(dataPointName);
        }
      }
      if (Math.floor(dataPointValue) == min) {
        if (!extremaCountries['min'].includes(dataPointName)) {
          extremaCountries['min'].push(dataPointName);
        }
      }
    }
    return extremaCountries;
  }

  getIndexOfCountry(data, countryName) {
    for (let i = 0; i < _.size(data); i++) {
      if (data[i][this.nameType] === (countryName)) {
        return i;
      }
    }
    return null;
  }

  generateRatioDataSet(begData, endData) {
    const results = [];
    for (let i = 0; i < _.size(begData); i++) {
      const index = this.getIndexOfCountry(endData, begData[i][this.nameType]);
      const dataPoint = {};
      if (index != null) {
        const begIndex = begData[i];
        const endIndex = endData[index];
        dataPoint['isComplete'] = true;
        dataPoint[this.nameType] = begIndex[this.nameType];
        dataPoint[this.yearType] = (endIndex[this.yearType] - begIndex[this.yearType]);
        dataPoint['Units of measurement'] = 'Percent';
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
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getColorForIndCountry(name, data, colors) {
    let result;
    const index = this.getIndexOfCountry(data, name);
    const value = data[index][this.dataType];
    let colorIndex = value + Math.abs(Math.round(this.getMinValueFromData(data)));
    if (value == this.getMaxValueFromData(data)) {
      colorIndex = _.size(colors) - 1;
    }
    if (value == this.getMinValueFromData(data)) {
      colorIndex = 0;
    }
    result = colors[colorIndex];
    return result;
  }

  async ngOnInit(selectedData= null, selectedYear= null, ratio= false) {

    this.choices = [
      {'name': 'Compulsory Education Duration', 'file': CompEduDuration, 'info': null},
      {'name': 'Compulsory Education Starting Age', 'file': CompEduStartAge, 'info': null},
      {'name': 'Gross Expense on R&D as a Percentage of GDP', 'file': GDExpRNDPercGDP, 'info': null},
      {'name': 'GDP Per Capita, PPP, in 2011 US Dollars', 'file': GDPCapitaConst2011, 'info': 'https://www.investopedia.com/updates/purchasing-power-parity-ppp/'},
      {'name': 'GDP Per Capita, PPP, in Current US Dollars', 'file': GDPCapitaCurrent, 'info': 'https://www.investopedia.com/updates/purchasing-power-parity-ppp/'},
      {'name': 'Total GDP, PPP, in 2011 US Dollars', 'file': GDPConst2011, 'info': 'https://www.investopedia.com/updates/purchasing-power-parity-ppp/'},
      {'name': 'Total GDP, PPP, in Current US Dollars', 'file': GDPCurrent, 'info': 'https://www.investopedia.com/updates/purchasing-power-parity-ppp/'},
      {'name': 'GINI Index (World Bank Estimate)', 'file': GINIWorldBankEstimate, 'info': 'https://www.investopedia.com/terms/g/gini-index.asp'},
      /*{'name': "Total GDP in Constant 2010 US Dollars", 'file': GDPConst2010, 'info': 'https://www.investopedia.com/terms/g/gdp.asp'},*/
      {'name': 'GDP Per Capita in Current US Dollars', 'file': GDPCapitaUSDConst, 'info': 'https://www.investopedia.com/terms/p/per-capita-gdp.asp'},
      {'name': 'Number of Newspaper Titles', 'file': NumberOfNewspaperTitles},
      {'name': 'Secondary Education Enrollment', 'file': SecondaryEducationAmt},
    ];
    let choice = selectedData;

    let isReverseColor = false;
    let perc;

    if (choice == null) {
      choice = 'Compulsory Education Duration';
    }
    let k = 0;
    for (let i = 0; i < this.choices.length; i++) {
      if (this.choices[i]['name'] == choice) {
        k = i;
      }
    }
    const summation = JSON.parse(this.choices[k]['file']);
    this.parsedData = '';
    perc = summation[0]['Units of measurement'] == 'Percent';

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
    if (this.choices[k]['name'].includes('Total GDP')) {
      GDP = true;
    }
    if (this.choices[k]['name'].includes('GINI')) {
      isReverseColor = true;
    }
    this.info = this.choices[k]['info'];

    const defaultFill = d3.rgb('#182233');
    const dataset = {};
    let year;

    if (ratio) {
      const begYear = parseInt(selectedYear[0]);
      const endYear = parseInt(selectedYear[1]);
      const dataBeg = this.getDataForYear(summation, begYear);
      const dataEnd = this.getDataForYear(summation, endYear);
      const ratioMap = this.generateRatioDataSet(dataBeg, dataEnd);
      const maxValue = this.getMaxValueFromData(ratioMap);
      const minValue = this.getMinValueFromData(ratioMap);
      const allRatioColors = this.getColorArray(maxValue, minValue, isReverseColor);
      year = begYear + ' to ' + endYear;

      this.allYears = this.getAllYears(summation);

      const countries = Datamap.prototype.worldTopo.objects.world.geometries;

      for (let i = 0; i < _.size(ratioMap); i++) {
        let indColor = defaultFill;
        if (ratioMap[i]['isComplete']) {
          indColor = this.getColorForIndCountry(ratioMap[i][this.nameType], ratioMap, allRatioColors);
          if (indColor == null) {
            indColor = d3.rgb(100, 100, 100);
          }
        } else {
          indColor = d3.rgb('#878E99');
        }
        const name = ratioMap[i][this.nameType];
        let ID;

        const begValue = dataBeg[this.getIndexOfCountry(dataBeg, name)][this.dataType];
        let endValue = dataEnd[this.getIndexOfCountry(dataEnd, name)];
        if (endValue) {
          endValue = endValue[this.dataType];
        } else {
          endValue = 'N/A';
        }
        for (let j = 0; j < _.size(countries); j++) {
          if (name === countries[j].properties.name) {
            ID = countries[j].id;
          }
        }

        dataset[ID] = {
          scoreGiven: ratioMap[i][this.dataType],
          fillColor: indColor,
          dataType: ratioMap[0]['Units of measurement'],
          begValue: begValue,
          endValue: endValue,
          oldType: dataBeg[1]['Units of measurement']
        };

      }


      this.maxmin = this.getMaxMinCountryFromData(ratioMap);

      this.title = choice + ' Relative Change from ' + begYear.toString() + ' to ' + endYear.toString();
      document.getElementById('title-sentence').innerText = this.title;

      this.max = this.getMaxValueFromData(ratioMap);
      this.min = this.getMinValueFromData(ratioMap);

      const map = new Datamap({
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
                '</div>'].join('');
            }
            if (data.scoreGiven == null) {
              return ['<div class="hoverinfo">',
                '<strong>', 'There is no data for ', geo.properties.name, ' in ', endYear, '</strong>',
                '</div>'].join('');
            }
            return ['<div class="hoverinfo">',
              '<strong>', geo.properties.name, '</strong>',
              '<br>Change: <strong>', data.scoreGiven, ' ', data.dataType, '</strong>',
              '<br>From: <strong>', data.begValue.toLocaleString(), ' ', data.oldType , ' to ', data.endValue.toLocaleString(), ' ', data.oldType , '</strong>',
              '</div>'].join('');
          }
        },
      });

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
      year = this.year;

      for (let i = 0; i < _.size(summation); i++) {
        const name = summation[i][this.nameType];
        const year = summation[i][this.yearType];
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
        this.totalEduDuration.set(name, this.eduDurationYearToValue);
      }

      this.allYears = this.getAllYears(summation);
      this.maxmin = this.getMaxMinCountry(summation, year);
      const max = this.getMaxValue(year);
      const min = this.getMinValue(year);

      const names = this.getCountryNames();
      const countries = Datamap.prototype.worldTopo.objects.world.geometries;
      for (let i = 0; i < names.length; i++) {
        for (let j = 0; j < _.size(countries); j++) {
          if (names[i] == countries[j].properties.name) {
            this.nameToID.set(names[i], countries[j].id);
          }
        }
      }

      const durationIDS = this.totalEduDuration.entries();
      for (let i = 0; i < this.totalEduDuration.size; i++) {
        const nameIDS = this.nameToID.entries();
        const thisduration = durationIDS.next();
        for (let j = 0; j < this.nameToID.size; j++) {
          const thisname = nameIDS.next();
          if (thisname.value[0] == thisduration.value[0]) {
            this.IDToYears.set(thisname.value[1], thisduration.value[1]);
          }
        }
      }

      const colorArray = this.getColorArray(max, min, isReverseColor);
      const countryColor = this.getCountryColor(year, colorArray);
      const countryIDS = countryColor.keys();
      for (let i = 0; i < countryColor.size; i++) {
        const thisID = countryIDS.next().value;
        let finScore = this.IDToYears.get(thisID).get(year);
        let finScoreString;
        try {
          finScoreString = finScore.toLocaleString();
          finScore = finScoreString;
        } catch (error) {
        }
        dataset[thisID] = {
          scoreGiven: finScore,
          fillColor: countryColor.get(thisID),
          dataType: summation[0]['Units of measurement']
        };
      }

      this.title = choice + ' in ' + this.year.toString();
      document.getElementById('title-sentence').innerText = this.title;

      this.descriptor = summation[0]['Units of measurement'];
      if (this.descriptor == null) {
        this.descriptor = 'Units';
        const countryIDS = countryColor.keys();
        for (let i = 0; i < _.size(dataset); i++) {
          const thisID = countryIDS.next().value;
          dataset[thisID]['dataType'] = 'Units';
        }
      }

      window.addEventListener('resize', function () {
        map.resize();
      });


      const map = new Datamap({
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
                '</div>'].join('');
            }
            if (data.scoreGiven == null) {
              return ['<div class="hoverinfo">',
                '<strong>', 'There is no data for ', geo.properties.name, ' in ', year, '</strong>',
                '</div>'].join('');
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
