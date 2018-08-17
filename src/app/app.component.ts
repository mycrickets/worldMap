import { Component } from '@angular/core';
import {CookieJarComponent} from './cookie-jar/cookie-jar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';

  constructor() { }

  isNew(){
    let cj = new CookieJarComponent();
    return !cj.isReturning()
  }
}
