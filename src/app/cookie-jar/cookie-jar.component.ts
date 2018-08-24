import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookie-jar',
  templateUrl: './cookie-jar.component.html',
  styleUrls: ['./cookie-jar.component.css']
})
export class CookieJarComponent implements OnInit {


  yesCookies(){
    console.log("hit yes cookie");
    document.cookie = "returning=true;expires=Mon, 31 Dec 2018 12:00:00 UTC; path=/";
    this.closeModal()
  }


  noCookies() {
    console.log("hit no cookie");
    this.closeModal()
  }

  closeModal(){
    console.log("hit close modal");
    document.getElementById('modal-box').remove();
    if(!this.isReturning()){
      console.log("hit activate splash");
      document.getElementById('splash-container').classList.add('is-active')
    }
  }

  isReturning(){
    console.log("hit is returning");
    let returning = document.cookie;
    if ("returning" in returning.split("=")){
      return true;
    }
    return false;
  }

  constructor() { }

  ngOnInit() {
    if (this.isReturning()) {
      this.closeModal()
    }
  }

}
