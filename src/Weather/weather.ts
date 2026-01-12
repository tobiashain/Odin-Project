import { weatherIcons } from './icons';
import type { Density, WeatherData, WeatherReturnData } from './types';

export default class Weather {
  private cache: WeatherReturnData | null = null;
  private cacheTimestamp = 0;
  private region = 'kitzb%C3%BChel';
  private readonly ttlMs = 10 * 60 * 1000; // 5 minutes;
  private readonly url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${this.region}?unitGroup=metric&include=days,current&key=${__WEATHER_API__}&contentType=json`;

  public async getWeather(): Promise<WeatherReturnData | null> {
    try {
      const now: number = Date.now();

      if (this.cache && now - this.cacheTimestamp < this.ttlMs) {
        return this.cache;
      }

      const { data, day, current } = await this.fetchData();

      if (!day || !current) {
        throw new Error('Data error! The requested data has not been found.');
      }

      const isDay = Weather.checkTime(
        Math.floor(Date.now() / 1000),
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
        tzoffset: data.tzoffset,
        temp: current.temp,
        feelslike: current.feelslike,
        tempMax: day.tempmax,
        tempMin: day.tempmin,
        humidity: current.humidity,
        winddir,
        windspeed: current.windspeed,
        windgust: current.windgust,
        pressure: current.pressure,
        sunset: Weather.formatTime(current.sunset),
        sunrise: Weather.formatTime(current.sunrise),
        density,
        preciptype: current.preciptype,
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

  private async fetchData() {
    const response = await fetch(this.url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data: WeatherData = await response.json();

    const day = data.days[0];
    const current = data.currentConditions;

    return { data, day, current };
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
    const rain = precip - snow;

    const radians = ((winddir - 180) * Math.PI) / 180;
    const windX = Math.cos(radians) * windspeed * 0.1;
    const windY = Math.sin(radians) * windspeed * 0.1;

    const density = { snow, rain, windX, windY };
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

  private static formatTime(time: string): string {
    const parts = time.split(':');
    const split = `${parts[0]}:${parts[1]}`;

    return split;
  }

  private static checkTime(
    dateTimeEpoch: number,
    sunriseEpoch: number,
    sunsetEpoch: number,
  ): boolean {
    return dateTimeEpoch >= sunriseEpoch && dateTimeEpoch < sunsetEpoch;
  }
}
