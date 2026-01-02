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
      preciptype: string[];
    },
  ];
}

export interface WeatherReturnData {
  address: string;
  temp: number;
  description: string;
  preciptype: string[];
  icon: string;
}
