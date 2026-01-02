import { weatherIcons } from './icons';

export default class Weather {
  constructor() {}

  public async getWeather() {}

  private defineIcon() {}

  private async getWeatherIcon(condition: string, isDay: boolean) {
    const iconSet = weatherIcons[condition] ?? weatherIcons.unknown;
    return isDay ? iconSet!.day : iconSet!.night;
  }
}
