import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DisplayComponent } from './display/display.component';
import { TitleComponent } from './title/title.component';
import { MapComponent } from './map/map.component';
import { TabsComponent } from './tabs/tabs.component';
import { OneTabComponent } from './one-tab/one-tab.component';
import { RatioTabComponent } from './ratio-tab/ratio-tab.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { AuthorPageComponent } from './author-page/author-page.component';
import { AppRoutingModule } from './app-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { AboutInfoComponent } from './about-info/about-info.component';
import { AuthorInfoComponent } from './author-info/author-info.component';
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { GraphTabComponent } from './graph-tab/graph-tab.component';
import { GraphContainerComponent } from './graph-container/graph-container.component';
import { DataService } from "./data-service/data.service";
import { CanvasChartComponent } from './canvas-chart/canvas-chart.component';
import { ResidCanvasChartComponent } from './resid-canvas-chart/resid-canvas-chart.component';

declare var require: any;
require('chartjs-plugin-zoom');

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DisplayComponent,
    TitleComponent,
    MapComponent,
    TabsComponent,
    OneTabComponent,
    RatioTabComponent,
    AboutPageComponent,
    AuthorPageComponent,
    MainPageComponent,
    AboutInfoComponent,
    AuthorInfoComponent,
    GraphTabComponent,
    GraphContainerComponent,
    CanvasChartComponent,
    ResidCanvasChartComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
