import { Component, OnInit } from '@angular/core';
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})

export class TabsComponent implements OnInit {

  constructor() {
  }

  clickOne(){
    console.log("to one");
    document.getElementById('one').classList.add('is-active');
    document.getElementById('ratio').classList.remove('is-active');
    document.getElementById('one-info').classList.remove('is-hidden');
    document.getElementById('ratio-info').classList.add('is-hidden');
  }

  clickRatio(){
    console.log("to ratio")
    document.getElementById('ratio').classList.add('is-active');
    document.getElementById('one').classList.remove('is-active');
    document.getElementById('ratio-info').classList.remove('is-hidden');
    document.getElementById('one-info').classList.add('is-hidden');
  }

  ngOnInit() {
  }

}
