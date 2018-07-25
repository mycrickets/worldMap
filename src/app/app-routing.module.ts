import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";

import {AboutPageComponent} from "./about-page/about-page.component";
import {AuthorPageComponent} from "./author-page/author-page.component";
import {MainPageComponent} from "./main-page/main-page.component";


const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full'},
  { path: 'main', component: MainPageComponent},
  { path: 'author', component: AuthorPageComponent},
  { path: 'about', component: AboutPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
