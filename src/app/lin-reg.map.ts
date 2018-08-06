export class LinRegMap{
  begYear: number;
  endYear: number;
  selectedX: string;
  selectedY: string;
  dataX: object;
  dataY: object;
  country: string;

  constructor(dataX, dataY, begYear, endYear, country){
    this.dataX = dataX;
    this.dataY = dataY;
    this.begYear = begYear;
    this.endYear = endYear;
    this.country = country;


  }

}
