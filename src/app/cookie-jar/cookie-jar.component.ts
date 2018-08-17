import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookie-jar',
  templateUrl: './cookie-jar.component.html',
  styleUrls: ['./cookie-jar.component.css']
})
export class CookieJarComponent implements OnInit {


  yesCookies(){
    document.cookie = "returning=true;expires=Mon, 31 Dec 2018 12:00:00 UTC; path=/";
    this.closeModal()
  }


  noCookies() {
    this.closeModal()
  }

  closeModal(){
    document.getElementById('modal-box').remove();
    if(!this.isReturning()){
      document.getElementById('splash-container').classList.add('is-active')
    }
  }

  isReturning(){
    let returning = document.cookie;
    return returning != ""
  }

  constructor() { }

  ngOnInit() {
    if (this.isReturning()) {
      this.closeModal()
    }
  }

}
