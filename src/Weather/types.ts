export interface WeatherData {
  address: string;
  days: [
    {
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
      pressure: number;
      conditions: string;
      description: string;
    },
  ];

  currentConditions: {
    datetimeEpoch: number;
    temp: number;
    feelslike: number;
    humidity: number;
    windspeed: number;
    winddir: number;
    pressure: number;
    conditions: string;
    sunriseEpoch: number;
    sunsetEpoch: number;
    sunset: string;
  };
}

export interface WeatherReturnData {
  address: string;
  temp: number;
  feelslike: number;
  tempMax: number;
  tempMin: number;
  humidity: number;
  winddir: number;
  windspeed: number;
  pressure: number;
  sunset: string;
  description: string;
  classCondition: string;
  condition: string;
  isDay: boolean;
  icon: string;
}
