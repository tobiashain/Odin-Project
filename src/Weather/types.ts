export interface WeatherData {
  address: string;
  tzoffset: number;
  days: Days[];
  currentConditions: Current;
}

export interface Days {
  datetimeEpoch: number;
  sunriseEpoch: number;
  sunsetEpoch: number;
  sunrise: string;
  sunset: string;
  moonphase: number;
  temp: number;
  tempmax: number;
  tempmin: number;
  feelslike: number;
  humidity: number;
  windspeed: number;
  winddir: number;
  snow: number;
  precip: number;
  preciptype: string[];
  pressure: number;
  conditions: string;
  description: string;
}

export interface Current {
  datetimeEpoch: number;
  temp: number;
  feelslike: number;
  humidity: number;
  windspeed: number;
  windgust: number;
  winddir: number;
  snow: number;
  precip: number;
  preciptype: string[];
  pressure: number;
  conditions: string;
  sunriseEpoch: number;
  sunsetEpoch: number;
  sunset: string;
  sunrise: string;
}

export interface WeatherReturnData {
  address: string;
  temp: number;
  feelslike: number;
  tempMax: number;
  tempMin: number;
  humidity: number;
  winddir: string;
  windspeed: number;
  windgust: number;
  pressure: number;
  sunset: string;
  sunrise: string;
  tzoffset: number;
  density: Density;
  preciptype: string[];
  description: string;
  classCondition: string;
  condition: string;
  isDay: boolean;
  icon: string;
}

export interface Density {
  snow: number;
  rain: number;
  windX: number;
  windY: number;
}
