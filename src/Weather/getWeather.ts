import { weatherIcons } from './icons';
import type { WeatherData, WeatherReturnData } from './types';

export default class Weather {
  private cache: WeatherReturnData | null = null;
  private cacheTimestamp = 0;
  private readonly ttlMs = 10 * 60 * 1000; // 10 minutes;
  private readonly url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/vienna?unitGroup=metric&include=days&key=${__WEATHER_API__}&contentType=json`;

  public async getWeather(): Promise<WeatherReturnData | null> {
    try {
      const now: number = Date.now();

      if (this.cache && now - this.cacheTimestamp < this.ttlMs) {
        return this.cache;
      }

      const response = await fetch(this.url);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data: WeatherData = await response.json();
      const day = data.days[0];

      const isDay = this.checkTime(
        day.dateTimeEpoch,
        day.sunriseEpoch,
        day.sunsetEpoch,
      );

      const icon = this.defineIcon(day.conditions, isDay);

      const result: WeatherReturnData = {
        address: data.address.charAt(0).toUpperCase() + data.address.slice(1),
        temp: day.temp,
        description: day.description,
        preciptype: day.preciptype.map((preciptype) => {
          return preciptype.charAt(0).toUpperCase() + preciptype.slice(1);
        }),
        icon,
      };

      this.cache = result;
      this.cacheTimestamp = now;

      return result;
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      return null;
    }
  }

  private defineIcon(conditions: string, isDay: boolean): string {
    const conditionList = conditions
      .toLowerCase()
      .split(',')
      .map((con) => con.trim());

    const hasSnow = conditionList.includes('snow');
    const hasRain = conditionList.includes('rain');
    const hasCloud = conditionList.includes('overcast');
    const hasPartlyCloudy = conditionList.includes('partially cloudy');
    const hasSun =
      conditionList.includes('sun') || conditionList.includes('clear');
    const hasThunder =
      conditionList.includes('thunder') ||
      conditionList.includes('thunderstorm');

    let condition: string;

    if (hasThunder) {
      condition = 'thunder';
    } else if (hasSnow) {
      if (hasRain && hasPartlyCloudy) {
        condition = 'rain-snow-sun';
      } else if (hasRain) {
        condition = 'rain-snow';
      } else if (hasPartlyCloudy) {
        condition = 'snow-sun';
      } else {
        condition = 'snow';
      }
    } else if (hasRain) {
      condition = hasPartlyCloudy ? 'rain-sun' : 'rain';
    } else if (hasPartlyCloudy) {
      condition = 'partly-cloudy';
    } else if (hasCloud) {
      condition = 'cloud';
    } else if (hasSun) {
      condition = 'sun';
    } else {
      condition = 'unknown';
    }

    return this.getWeatherIcon(condition, isDay);
  }

  private getWeatherIcon(condition: string, isDay: boolean): string {
    const iconSet = weatherIcons[condition];
    const path = isDay ? iconSet!.day : iconSet!.night;
    return path.replace(/^\.\/Weather/, '.');
  }

  private checkTime(
    dateTimeEpoch: number,
    sunriseEpoch: number,
    sunsetEpoch: number,
  ): boolean {
    return dateTimeEpoch >= sunriseEpoch && dateTimeEpoch < sunsetEpoch;
  }
}
