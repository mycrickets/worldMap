import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})

export class TabsComponent implements OnInit {

  constructor() {
  }

  clickOne(){
    document.getElementById('one').classList.add('is-active');
    document.getElementById('ratio').classList.remove('is-active');
    document.getElementById('graph').classList.remove('is-active');
    document.getElementById('one-info').classList.remove('is-hidden');
    document.getElementById('graph-info').classList.add('is-hidden');
    document.getElementById('ratio-info').classList.add('is-hidden');
  }

  clickRatio(){
    document.getElementById('ratio').classList.add('is-active');
    document.getElementById('one').classList.remove('is-active');
    document.getElementById('graph').classList.remove('is-active');
    document.getElementById('ratio-info').classList.remove('is-hidden');
    document.getElementById('graph-info').classList.add('is-hidden');
    document.getElementById('one-info').classList.add('is-hidden');
  }

  clickGraph(){
    document.getElementById('ratio').classList.remove('is-active');
    document.getElementById('one').classList.remove('is-active');
    document.getElementById('graph').classList.add('is-active');
    document.getElementById('ratio-info').classList.add('is-hidden');
    document.getElementById('graph-info').classList.remove('is-hidden');
    document.getElementById('one-info').classList.add('is-hidden');

  }

  ngOnInit() {
    this.clickGraph()
  }

}
