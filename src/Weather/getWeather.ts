import { weatherIcons } from './icons';
import type { WeatherData, WeatherReturnData } from './types';

export default class Weather {
  constructor() {}

  public async getWeather() {
    const response = await fetch('');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data: WeatherData = await response.json();
    const icon: string = this.defineIcon(
      data.days[0].conditions,
      this.checkTime(
        data.days[0].dateTimeEpoch,
        data.days[0].sunriseEpoch,
        data.days[0].sunsetEpoch,
      ),
    );

    const returnData: WeatherReturnData = {
      address: data.address.toUpperCase(),
      temp: data.days[0].temp,
      description: data.days[0].description,
      precitype: data.days[0].precitype.toUpperCase(),
      icon,
    };

    return returnData;
  }

  private defineIcon(conditions: string, isDay: boolean): string {
    let condition: string;
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
    const iconSet = weatherIcons[condition] ?? weatherIcons.unknown;
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
