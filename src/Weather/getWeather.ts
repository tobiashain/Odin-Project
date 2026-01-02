import { weatherIcons } from './icons';
import type { WeatherData, WeatherReturnData } from './types';

export default class Weather {
  private cache: WeatherReturnData | null = null;
  private cacheTimestamp = 0;
  private readonly ttlMs = 10 * 60 * 1000; // 10 minutes;

  public async getWeather(): Promise<WeatherReturnData> {
    const now: number = Date.now();

    if (this.cache && now - this.cacheTimestamp < this.ttlMs) {
      return this.cache;
    }

    const response = await fetch('');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data: WeatherData = await response.json();
    const day = data.days[0];

    const isDay = this.checkTime(
      day.dateTimeEpoch,
      day.sunriseEpoch,
      day.sunsetEpoch,
    );

    const icon = this.defineIcon(day.conditions, isDay);

    const result: WeatherReturnData = {
      address: data.address.toUpperCase(),
      temp: day.temp,
      description: day.description,
      precitype: day.precitype.toUpperCase(),
      icon,
    };

    this.cache = result;
    this.cacheTimestamp = now;

    return result;
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
    return isDay ? iconSet!.day : iconSet!.night;
  }

  private checkTime(
    dateTimeEpoch: number,
    sunriseEpoch: number,
    sunsetEpoch: number,
  ): boolean {
    return dateTimeEpoch >= sunriseEpoch && dateTimeEpoch < sunsetEpoch;
  }
}
