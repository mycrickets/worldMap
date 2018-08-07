import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class DataService {
  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  private countries = new BehaviorSubject([]);
  currentCountriesList = this.countries.asObservable();

  constructor() { }

  changeMessage(message:number){
    this.messageSource.next(message);
  }
  changeCountriesList(countries){
    this.countries.next(countries);
  }
}
