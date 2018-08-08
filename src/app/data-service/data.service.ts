import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class DataService {
  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  private countries = new BehaviorSubject([]);
  currentCountriesList = this.countries.asObservable();

  private isScatter = new BehaviorSubject([]);
  currentIsScatter = this.isScatter.asObservable();

  private isResid = new BehaviorSubject([]);
  currentIsResid = this.isResid.asObservable();

  private isOneLSRL = new BehaviorSubject(false);
  currentIsOneLSRL = this.isOneLSRL.asObservable();

  private isOneResid = new BehaviorSubject(false);
  currentIsOneResid = this.isOneResid.asObservable();

  private isOneResult = new BehaviorSubject(false);
  currentIsOneResult = this.isOneResult.asObservable();

  constructor() { }

  changeMessage(message:number){
    this.messageSource.next(message);
  }
  changeCountriesList(countries){
    this.countries.next(countries);
  }
  changeIsScatter(isScatter){
    this.isScatter.next(isScatter);
  }
  changeIsResid(isResid){
    this.isResid.next(isResid);
  }
  changeIsOneLSRL(isLSRL){
    this.isOneLSRL.next(isLSRL);
  }
  changeIsOneResid(isResid){
    this.isOneResid.next(isResid);
  }
  changeIsOneResult(isResult){
    this.isOneResult.next(isResult);
  }
}
