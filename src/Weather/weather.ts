import { weatherIcons } from './icons';
import type { Density, WeatherData, WeatherReturnData } from './types';

export default class Weather {
  private cache: WeatherReturnData | null = null;
  private cacheTimestamp = 0;
  private readonly ttlMs = 10 * 60 * 1000; // 10 minutes;
  private readonly url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/kitzb%C3%BChel?unitGroup=metric&include=days,current&key=${__WEATHER_API__}&contentType=json`;

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
      const current = data.currentConditions;

      const isDay = Weather.checkTime(
        current.datetimeEpoch,
        day.sunriseEpoch,
        day.sunsetEpoch,
      );

      const { icon, classCondition } = Weather.defineIcon(
        current.conditions,
        isDay,
      );

      const density = Weather.calculateDensity(
        current.precip,
        current.snow,
        current.windspeed,
        current.winddir,
      );

      const winddir = Weather.degreesToCardinal(current.winddir);

      const result: WeatherReturnData = {
        address: data.address.charAt(0).toUpperCase() + data.address.slice(1),
        temp: current.temp,
        feelslike: current.feelslike,
        tempMax: day.tempmax,
        tempMin: day.tempmin,
        humidity: current.humidity,
        winddir,
        windspeed: current.windspeed,
        pressure: current.pressure,
        sunset: day.sunset,
        density,
        description: day.description,
        classCondition,
        condition: current.conditions,
        isDay,
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

  private static defineIcon(
    conditions: string,
    isDay: boolean,
  ): { icon: string; classCondition: string } {
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

    let classCondition: string;

    if (hasThunder) {
      classCondition = 'thunder';
    } else if (hasSnow) {
      if (hasRain && hasPartlyCloudy) {
        classCondition = 'rain-snow-sun';
      } else if (hasRain) {
        classCondition = 'rain-snow';
      } else if (hasPartlyCloudy) {
        classCondition = 'snow-sun';
      } else {
        classCondition = 'snow';
      }
    } else if (hasRain) {
      classCondition = hasPartlyCloudy ? 'rain-sun' : 'rain';
    } else if (hasPartlyCloudy) {
      classCondition = 'partly-cloudy';
    } else if (hasCloud) {
      classCondition = 'cloud';
    } else if (hasSun) {
      classCondition = 'sunny';
    } else {
      classCondition = 'unknown';
    }

    const icon = Weather.getWeatherIcon(classCondition, isDay);

    return { icon, classCondition };
  }

  private static calculateDensity(
    precip: number,
    snow: number,
    windspeed: number,
    winddir: number,
  ): Density {
    const liquidSnow = snow / 10;
    const liquidRain = precip - liquidSnow;

    const radians = ((winddir - 180) * Math.PI) / 180;
    const windX = Math.cos(radians) * windspeed * 0.1;
    const windY = Math.sin(radians) * windspeed * 0.1;

    const density = { snow: liquidSnow, rain: liquidRain, windX, windY };
    return density;
  }

  private static getWeatherIcon(condition: string, isDay: boolean): string {
    const iconSet = weatherIcons[condition];
    const path = isDay ? iconSet!.day : iconSet!.night;
    return path.replace(/^\.\/Weather/, '.');
  }

  private static degreesToCardinal(deg: number): string {
    const directions = [
      'North',
      'North Northeast',
      'Northeast',
      'East Northeast',
      'East',
      'East Southeast',
      'Southeast',
      'South Southeast',
      'South',
      'South Southwest',
      'Southwest',
      'West Southwest',
      'West',
      'West Northwest',
      'Northwest',
      'North Northwest',
    ];

    const index = Math.round(deg / 22.5) % 16;
    return directions[index] ?? '';
  }

  private static checkTime(
    dateTimeEpoch: number,
    sunriseEpoch: number,
    sunsetEpoch: number,
  ): boolean {
    return dateTimeEpoch >= sunriseEpoch && dateTimeEpoch < sunsetEpoch;
  }
}
