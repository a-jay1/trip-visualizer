export interface Place {
  name: string;
  image: string;
  lat: number;
  lng: number;
  description: string;
}

export interface Destination {
  day: number;
  name: string;
  image: string;
  lat: number;
  lng: number;
  description: string;
  places: Place[];
}

export interface Source {
  name: string;
  image: string;
  lat: number;
  lng: number;
  description: string;
}

export interface MapData {
  source: Source;
  destinations: Destination[];
}

export interface SelectedPlace extends Place {
  day?: number;
  places?: Place[];
}
