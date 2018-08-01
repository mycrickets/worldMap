export class LinRegMap{
  begYear: number;
  endYear: number;
  selectedX: string;
  selectedY: string;
  dataX: object;
  dataY: object;

  constructor(dataX, dataY){
    this.dataX = dataX;
    this.dataY = dataY;
  }

}
