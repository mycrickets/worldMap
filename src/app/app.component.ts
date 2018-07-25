import { Component } from '@angular/core';

import { CompEduDuration } from '../assets/CompEduDuration'
import { CompEduStartAge } from "../assets/CompEduStartAge";
import { GDExpRNDPercGDP } from "../assets/GDExpRNDPercGDP";
import { GDPCapitaConst2011 } from "../assets/GDPCapitaConst2011";
import { GDPCapitaCurrent } from "../assets/GDPCapitaCurrent";
import { GDPConst2011 } from "../assets/GDPConst2011";
import { GDPCurrent } from "../assets/GDPCurrent";
import { GINIWorldBankEstimate } from "../assets/GINIWorldBankEstimate";
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

  constructor() { }

}
