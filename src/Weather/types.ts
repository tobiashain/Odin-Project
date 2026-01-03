export interface WeatherData {
  address: string;
  days: [
    {
      dateTimeEpoch: number;
      sunriseEpoch: number;
      sunsetEpoch: number;
      temp: number;
      conditions: string;
      description: string;
    },
  ];
}

export interface WeatherReturnData {
  address: string;
  temp: number;
  description: string;
  condition: string;
  isDay: boolean;
  icon: string;
}
