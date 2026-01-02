import cloudDay from './icons/cloud-day.svg';
import cloudNight from './icons/cloud-night.svg';
import partlyCloudyDay from './icons/partlycloudy-day.svg';
import partlyCloudyNight from './icons/partlycloudy-night.svg';
import rainDay from './icons/rain-day.svg';
import rainNight from './icons/rain-night.svg';
import rainSunDay from './icons/rain-sun-day.svg';
import rainSunNight from './icons/rain-sun-night.svg';
import rainSnowDay from './icons/rain-snow-day.svg';
import rainSnowNight from './icons/rain-snow-night.svg';
import rainSnowSunDay from './icons/rain-snow-sun-day.svg';
import rainSnowSunNight from './icons/rain-snow-sun-night.svg';
import snowDay from './icons/snow-day.svg';
import snowNight from './icons/snow-night.svg';
import snowSunDay from './icons/snow-sun-day.svg';
import snowSunNight from './icons/snow-sun-night.svg';
import sunDay from './icons/sun-day.svg';
import sunNight from './icons/sun-night.svg';
import thunderDay from './icons/thunder-day.svg';
import thunderNight from './icons/thunder-night.svg';
import unknownDay from './icons/unknown-day.svg';
import unknownNight from './icons/unknown-night.svg';

export const weatherIcons: Record<string, { day: string; night: string }> = {
  cloud: { day: cloudDay, night: cloudNight },
  'partly-cloudy': { day: partlyCloudyDay, night: partlyCloudyNight },
  rain: { day: rainDay, night: rainNight },
  'rain-sun': { day: rainSunDay, night: rainSunNight },
  'rain-snow': { day: rainSnowDay, night: rainSnowNight },
  'rain-snow-sun': { day: rainSnowSunDay, night: rainSnowSunNight },
  snow: { day: snowDay, night: snowNight },
  'snow-sun': { day: snowSunDay, night: snowSunNight },
  sun: { day: sunDay, night: sunNight },
  thunder: { day: thunderDay, night: thunderNight },
  unknown: { day: unknownDay, night: unknownNight },
};
