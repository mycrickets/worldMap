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

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DisplayComponent,
    TitleComponent,
    MapComponent,
    TabsComponent,
    OneTabComponent,
    RatioTabComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
