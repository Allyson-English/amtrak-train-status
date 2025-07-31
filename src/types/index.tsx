export interface TrainDetails {
  trainID: string;
  trainNum: string;
  origName: string;
  destName: string;
  alerts: Alert[];
  stations: Station[];
}

export interface Alert {
  message: string;
}

export interface Station {
  code: string;
  name: string;
  arr: string;
  schArr: string;
  dep: string;
  schDep: string;
  status: string;
}
